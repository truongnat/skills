from __future__ import annotations

import importlib.util
import json
import os
from pathlib import Path
from types import ModuleType


REPO_ROOT = Path(__file__).resolve().parents[1]


def load_tool(name: str, filename: str) -> ModuleType:
    path = REPO_ROOT / "tools" / name / filename
    spec = importlib.util.spec_from_file_location(name.replace("-", "_"), path)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


choice_reader = load_tool("choice-reader", "read.py")
session_serve = load_tool("session-serve", "serve.py")
video_keyframes = load_tool("video-keyframes", "extract.py")


def make_session(sessions: Path, name: str, timestamp: int) -> Path:
    session = sessions / name
    logs = session / "decision-logs"
    logs.mkdir(parents=True)
    page = session / "VISUAL_DECISION.html"
    page.write_text("<!doctype html>", encoding="utf-8")
    choices = logs / "choices.jsonl"
    choices.write_text(
        "\n".join(
            [
                json.dumps({"issue_id": "ISS-1", "choice": "A"}),
                json.dumps({"issue_id": "ISS-2", "choice": "B"}),
                json.dumps({"issue_id": "ISS-1", "choice": "C"}),
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    os.utime(page, (timestamp, timestamp))
    os.utime(choices, (timestamp, timestamp))
    return session


def test_choice_reader_discovers_latest_and_filters_issue(
    tmp_path: Path, capsys
) -> None:
    sessions = tmp_path / "sessions"
    make_session(sessions, "older", 100)
    make_session(sessions, "newer", 200)

    result = choice_reader.main(
        ["--sessions-dir", str(sessions), "--issue-id", "ISS-1"]
    )

    assert result == 0
    assert json.loads(capsys.readouterr().out)["choice"] == "C"


def test_session_serve_resolves_latest_and_named_session(tmp_path: Path) -> None:
    sessions = tmp_path / "sessions"
    older = make_session(sessions, "older", 100)
    newer = make_session(sessions, "newer", 200)

    latest, filename = session_serve.resolve_session(
        None, sessions, "VISUAL_DECISION.html"
    )
    named, _ = session_serve.resolve_session(
        Path("older"), sessions, "VISUAL_DECISION.html"
    )

    assert latest == newer
    assert named == older
    assert filename == "VISUAL_DECISION.html"


def test_session_serve_supports_report_html(tmp_path: Path) -> None:
    sessions = tmp_path / "sessions"
    session = sessions / "business-analysis"
    session.mkdir(parents=True)
    report = session / "BUSINESS_ANALYSIS.html"
    report.write_text("<!doctype html>", encoding="utf-8")

    resolved, filename = session_serve.resolve_session(
        None, sessions, "BUSINESS_ANALYSIS.html"
    )

    assert resolved == session
    assert filename == "BUSINESS_ANALYSIS.html"


def test_session_serve_builds_decision_server_command(tmp_path: Path) -> None:
    server = tmp_path / "server.py"
    session = tmp_path / "session"
    session.mkdir()

    command = session_serve.build_command(
        server=server,
        session=session,
        filename="VISUAL_DECISION.html",
        host="127.0.0.1",
        port=9000,
        log_dir=None,
        open_browser=False,
    )

    assert str(server) in command
    assert command[command.index("--root") + 1] == str(session)
    assert command[command.index("--log-dir") + 1] == str(
        (session / "decision-logs").resolve()
    )
    assert "--open" not in command


def test_video_keyframes_builds_bounded_sampling_command(tmp_path: Path) -> None:
    source = tmp_path / "bug.webm"
    output = tmp_path / "frames" / "frame-%04d.jpg"

    command = video_keyframes.build_ffmpeg_command(
        ffmpeg="/usr/bin/ffmpeg",
        source=source,
        output_pattern=output,
        interval=2.5,
        max_frames=40,
        width=1280,
        start=3.0,
        end=13.0,
        overwrite=False,
    )

    assert command[command.index("-ss") + 1] == "3.0"
    assert command[command.index("-t") + 1] == "10.0"
    assert command[command.index("-frames:v") + 1] == "40"
    assert "fps=1/2.5" in command[command.index("-vf") + 1]
    assert str(output) == command[-1]


def test_video_keyframes_writes_manifest_and_report(tmp_path: Path) -> None:
    source = tmp_path / "bug.webm"
    source.write_bytes(b"video placeholder")
    output = tmp_path / "frames"
    output.mkdir()
    frames = [output / "frame-0001.jpg", output / "frame-0002.jpg"]
    for frame in frames:
        frame.write_bytes(b"image placeholder")

    video_keyframes.write_artifacts(
        source=source,
        output_dir=output,
        frames=frames,
        interval=5.0,
        start=2.0,
        metadata={"duration_seconds": 20.0},
    )

    manifest = json.loads((output / "manifest.json").read_text(encoding="utf-8"))
    assert [item["sampled_at_seconds"] for item in manifest["frames"]] == [2.0, 7.0]
    report = (output / "KEYFRAMES.md").read_text(encoding="utf-8")
    assert "frame-0001.jpg" in report
    assert "Sampling can miss brief transitions" in report
