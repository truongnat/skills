from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

import pytest


REPO_ROOT = Path(__file__).resolve().parents[1]


def make_source(tmp_path: Path) -> Path:
    shutil.copy2(REPO_ROOT / "install.sh", tmp_path / "install.sh")
    docs = tmp_path / "docs"
    docs.mkdir()
    (docs / "AGENTS.md").write_text("installed rules\n", encoding="utf-8")
    (docs / "DESIGN_SYSTEM.md").write_text("design\n", encoding="utf-8")
    (docs / "THIRD_PARTY_SKILLS.md").write_text("licenses\n", encoding="utf-8")
    (docs / "settings.yaml").write_text("language: en\n", encoding="utf-8")
    tools = tmp_path / "tools"
    tools.mkdir()
    (tools / "README.md").write_text("tools\n", encoding="utf-8")
    decision_server = tools / "decision-server"
    decision_server.mkdir()
    (decision_server / "server.py").write_text("# decision server\n", encoding="utf-8")
    (decision_server / "client.js").write_text("// client\n", encoding="utf-8")
    (decision_server / "README.md").write_text("decision server\n", encoding="utf-8")
    choice_reader = tools / "choice-reader"
    choice_reader.mkdir()
    (choice_reader / "read.py").write_text("# choice reader\n", encoding="utf-8")
    session_serve = tools / "session-serve"
    session_serve.mkdir()
    (session_serve / "serve.py").write_text("# session serve\n", encoding="utf-8")
    video_keyframes = tools / "video-keyframes"
    video_keyframes.mkdir()
    (video_keyframes / "extract.py").write_text("# video keyframes\n", encoding="utf-8")
    for skill in ("planning", "execution"):
        root = tmp_path / "skills" / skill
        root.mkdir(parents=True)
        (root / "SKILL.md").write_text(f"# {skill}\n", encoding="utf-8")
    return tmp_path


def run_installer(root: Path, mode: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["bash", "install.sh", "--agents-mode", mode],
        cwd=root,
        stdin=subprocess.DEVNULL,
        text=True,
        capture_output=True,
        check=True,
    )


@pytest.mark.parametrize(
    ("mode", "expected"),
    [
        ("replace", "installed rules\n"),
        ("skip", "existing rules\n"),
        ("prompt", "existing rules\n"),
    ],
)
def test_agents_conflict_modes(tmp_path: Path, mode: str, expected: str) -> None:
    root = make_source(tmp_path)
    (root / "AGENTS.md").write_text("existing rules\n", encoding="utf-8")
    obsolete = root / ".agents" / "AGENTS.md"
    obsolete.parent.mkdir()
    obsolete.write_text("obsolete rules\n", encoding="utf-8")

    result = run_installer(root, mode)

    assert (root / "AGENTS.md").read_text(encoding="utf-8") == expected
    assert not obsolete.exists()
    if mode == "prompt":
        assert "no interactive terminal" in result.stderr


def test_agents_created_at_project_root(tmp_path: Path) -> None:
    root = make_source(tmp_path)

    run_installer(root, "prompt")

    assert (root / "AGENTS.md").read_text(encoding="utf-8") == "installed rules\n"
    assert not (root / ".agents" / "AGENTS.md").exists()
    assert (root / ".agents" / "settings.yaml").read_text(encoding="utf-8") == "language: en\n"


def test_existing_settings_are_preserved(tmp_path: Path) -> None:
    root = make_source(tmp_path)
    settings = root / ".agents" / "settings.yaml"
    settings.parent.mkdir()
    settings.write_text("language: vi\nrules:\n  branch:\n    base: develop\n", encoding="utf-8")

    run_installer(root, "replace")

    assert settings.read_text(encoding="utf-8") == (
        "language: vi\nrules:\n  branch:\n    base: develop\n"
    )


def test_skill_reinstall_removes_stale_files_and_preserves_venv(tmp_path: Path) -> None:
    root = make_source(tmp_path)
    run_installer(root, "replace")
    installed = root / ".agents" / "skills" / "planning"
    (installed / "stale.md").write_text("obsolete\n", encoding="utf-8")
    venv_marker = installed / ".venv" / "keep.txt"
    venv_marker.parent.mkdir()
    venv_marker.write_text("preserve\n", encoding="utf-8")

    run_installer(root, "replace")

    assert not (installed / "stale.md").exists()
    assert venv_marker.read_text(encoding="utf-8") == "preserve\n"
    assert (installed / "SKILL.md").is_file()


def test_tools_are_installed_and_logs_preserved(tmp_path: Path) -> None:
    root = make_source(tmp_path)
    run_installer(root, "replace")

    tools = root / ".agents" / "tools"
    decision_server = tools / "decision-server"
    assert (decision_server / "server.py").read_text(encoding="utf-8") == "# decision server\n"
    assert (decision_server / "client.js").is_file()
    assert (tools / "choice-reader" / "read.py").is_file()
    assert (tools / "session-serve" / "serve.py").is_file()
    assert (tools / "video-keyframes" / "extract.py").is_file()

    logs = tools / "decision-logs"
    logs.mkdir()
    (logs / "choices.jsonl").write_text('{"choice":"A"}\n', encoding="utf-8")
    (tools / "stale.txt").write_text("remove me\n", encoding="utf-8")
    (root / "tools" / "decision-server" / "server.py").write_text(
        "# updated server\n", encoding="utf-8"
    )

    run_installer(root, "replace")

    assert (decision_server / "server.py").read_text(encoding="utf-8") == "# updated server\n"
    assert not (tools / "stale.txt").exists()
    assert (logs / "choices.jsonl").read_text(encoding="utf-8") == '{"choice":"A"}\n'
