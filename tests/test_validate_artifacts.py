from __future__ import annotations

import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
VALIDATOR = REPO_ROOT / "tools" / "session" / "validate_artifacts.py"


def test_validate_artifacts_accepts_seeded_discussion(tmp_path: Path) -> None:
    session = tmp_path / ".agents" / "sessions" / "Task-1-demo"
    session.mkdir(parents=True)
    (tmp_path / ".agents" / "sessions" / ".current").write_text(
        ".agents/sessions/Task-1-demo\n", encoding="utf-8"
    )
    template = (
        REPO_ROOT / "skills" / "brainstorming" / "templates" / "DISCUSSION.template.md"
    ).read_text(encoding="utf-8")
    (session / "DISCUSSION.md").write_text(template, encoding="utf-8")
    overview = (
        REPO_ROOT / "skills" / "brainstorming" / "templates" / "OVERVIEW.template.md"
    ).read_text(encoding="utf-8")
    (session / "OVERVIEW.md").write_text(overview, encoding="utf-8")

    result = subprocess.run(
        ["python3", str(VALIDATOR), "--root", str(tmp_path)],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, result.stdout + result.stderr
    assert "SESSION_ARTIFACTS_OK" in result.stdout


def test_validate_artifacts_fails_on_missing_heading(tmp_path: Path) -> None:
    session = tmp_path / ".agents" / "sessions" / "Task-1-bad"
    session.mkdir(parents=True)
    (tmp_path / ".agents" / "sessions" / ".current").write_text(
        ".agents/sessions/Task-1-bad\n", encoding="utf-8"
    )
    (session / "REVIEW.md").write_text("# Review\n\n## Executive summary\n\n- x\n", encoding="utf-8")

    result = subprocess.run(
        ["python3", str(VALIDATOR), "--root", str(tmp_path)],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 1
    assert "SESSION_ARTIFACTS_FAILED" in result.stdout
    assert "Developer overview" in result.stdout
