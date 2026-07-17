from __future__ import annotations

import importlib.util
import json
import threading
from http.client import HTTPConnection
from pathlib import Path
from types import ModuleType

import pytest


REPO_ROOT = Path(__file__).resolve().parents[1]


def load_decision_server() -> ModuleType:
    path = REPO_ROOT / "tools" / "decision-server" / "server.py"
    spec = importlib.util.spec_from_file_location("decision_server", path)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


decision_server = load_decision_server()


def test_append_jsonl_writes_sorted_line(tmp_path: Path) -> None:
    path = tmp_path / "choices.jsonl"
    decision_server.append_jsonl(path, {"b": 2, "a": 1})
    line = path.read_text(encoding="utf-8").strip()
    assert json.loads(line) == {"a": 1, "b": 2}


@pytest.fixture()
def decision_http(tmp_path: Path):
    root = tmp_path / "pages"
    root.mkdir()
    (root / "VISUAL_DECISION.html").write_text(
        '<!doctype html><html data-issue-id="ISS-1"><body>'
        '<button data-choice="A">A</button></body></html>',
        encoding="utf-8",
    )
    log_dir = tmp_path / "logs"
    log_dir.mkdir()
    tools = REPO_ROOT / "tools" / "decision-server"
    client_js = tools / "client.js"
    animate_js = tools / "animate.js"
    styles_css = tools / "styles.css"
    tailwind_theme_js = tools / "tailwind-theme.js"
    assert client_js.is_file()
    assert animate_js.is_file()
    assert styles_css.is_file()
    assert tailwind_theme_js.is_file()

    server = decision_server.ThreadingHTTPServer(
        ("127.0.0.1", 0), decision_server.DecisionHandler
    )
    server.root = root
    server.log_dir = log_dir
    server.client_js = client_js
    server.animate_js = animate_js
    server.styles_css = styles_css
    server.tailwind_theme_js = tailwind_theme_js
    server.default_file = "VISUAL_DECISION.html"
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    host, port = server.server_address
    try:
        yield {"host": host, "port": port, "log_dir": log_dir, "root": root}
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=2)


def _post_json(host: str, port: int, path: str, payload: dict) -> tuple[int, dict]:
    body = json.dumps(payload).encode("utf-8")
    conn = HTTPConnection(host, port, timeout=5)
    try:
        conn.request(
            "POST",
            path,
            body=body,
            headers={"Content-Type": "application/json"},
        )
        response = conn.getresponse()
        data = json.loads(response.read().decode("utf-8"))
        return response.status, data
    finally:
        conn.close()


def _get(host: str, port: int, path: str) -> tuple[int, bytes]:
    conn = HTTPConnection(host, port, timeout=5)
    try:
        conn.request("GET", path)
        response = conn.getresponse()
        return response.status, response.read()
    finally:
        conn.close()


def test_choice_endpoint_appends_jsonl(decision_http) -> None:
    status, data = _post_json(
        decision_http["host"],
        decision_http["port"],
        "/api/choice",
        {"issue_id": "ISS-1", "choice": "A", "note": "prefer A"},
    )
    assert status == 200
    assert data["ok"] is True

    choices = (decision_http["log_dir"] / "choices.jsonl").read_text(encoding="utf-8")
    record = json.loads(choices.strip())
    assert record["issue_id"] == "ISS-1"
    assert record["choice"] == "A"
    assert record["note"] == "prefer A"
    assert "received_at" in record


def test_html_injects_enterprise_assets(decision_http) -> None:
    status, body = _get(
        decision_http["host"],
        decision_http["port"],
        "/VISUAL_DECISION.html",
    )
    assert status == 200
    html = body.decode("utf-8")
    assert "cdn.tailwindcss.com" in html
    assert "animejs@3.2.2" in html
    assert 'src="/tailwind-theme.js"' in html
    assert 'href="/styles.css"' in html
    assert 'src="/animate.js"' in html
    assert 'src="/client.js"' in html
    assert 'data-ss-theme="enterprise"' in html


def test_styles_and_theme_endpoints(decision_http) -> None:
    status, body = _get(
        decision_http["host"],
        decision_http["port"],
        "/styles.css",
    )
    assert status == 200
    assert b"--ss-interactive:" in body
    assert b"--ss-background:" in body

    status, body = _get(
        decision_http["host"],
        decision_http["port"],
        "/tailwind-theme.js",
    )
    assert status == 200
    assert b"tailwind.config" in body
    assert b"accent" in body or b"ink" in body

    status, body = _get(
        decision_http["host"],
        decision_http["port"],
        "/animate.js",
    )
    assert status == 200
    assert b"SimpleSkillsAnimate" in body
    assert b"data-ss-animate" in body

    status, raw = _get(
        decision_http["host"],
        decision_http["port"],
        "/api/health",
    )
    assert status == 200
    data = json.loads(raw.decode("utf-8"))
    assert data["ok"] is True
    assert data["theme"] == "enterprise"
