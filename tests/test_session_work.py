from __future__ import annotations

import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SESSION_SH = REPO_ROOT / "tools" / "session" / "session.sh"


def _run(cwd: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["bash", str(SESSION_SH), *args],
        cwd=cwd,
        capture_output=True,
        text=True,
        check=True,
    )


def test_session_new_uses_agent_work_and_nested_git(tmp_path: Path) -> None:
    (tmp_path / ".agents").mkdir()
    result = _run(tmp_path, "new", "demo-feature")
    rel = result.stdout.strip()
    assert rel.startswith(".agent-work/sessions/Task-1-demo-feature")
    assert (tmp_path / rel).is_dir()
    assert (tmp_path / ".agent-work" / "memory").is_dir()
    assert (tmp_path / ".agent-work" / ".git").is_dir()
    assert (tmp_path / ".agent-work" / "sessions" / ".current").read_text(
        encoding="utf-8"
    ).strip() == rel

    current = _run(tmp_path, "current")
    assert current.stdout.strip() == rel

    work_root = _run(tmp_path, "work-root")
    assert work_root.stdout.strip() == ".agent-work"

    # new auto-commits → at least init + create
    log = subprocess.run(
        ["git", "-C", str(tmp_path / ".agent-work"), "log", "--oneline"],
        capture_output=True,
        text=True,
        check=True,
    )
    assert "chore(session): create Task-1-demo-feature" in log.stdout
    assert len(log.stdout.strip().splitlines()) >= 2


def test_session_commit_dirty_then_clean(tmp_path: Path) -> None:
    (tmp_path / ".agents").mkdir()
    rel = _run(tmp_path, "new", "commit-demo").stdout.strip()
    artifact = tmp_path / rel / "DISCUSSION.md"
    artifact.write_text("## Goal\n\nDemo.\n", encoding="utf-8")

    dirty = _run(tmp_path, "commit", "docs(brainstorming): DISCUSSION — demo")
    assert dirty.stdout.startswith("WORK_COMMIT=")
    assert "clean" not in dirty.stdout.split("=")[1].split()[0]

    clean = _run(tmp_path, "commit")
    assert "WORK_COMMIT=clean" in clean.stdout

    doctor = _run(tmp_path, "doctor")
    assert "work_dirty=no" in doctor.stdout
    assert "last_commit=" in doctor.stdout


def test_session_archive_moves_and_commits(tmp_path: Path) -> None:
    (tmp_path / ".agents").mkdir()
    rel = _run(tmp_path, "new", "archive-demo").stdout.strip()
    (tmp_path / rel / "DONE.md").write_text("## Status\n\nDone\n", encoding="utf-8")
    _run(tmp_path, "commit", "chore(done): Task-1-archive-demo memory + close")

    archived = _run(tmp_path, "archive").stdout.strip()
    assert archived == ".agent-work/sessions/_archive/Task-1-archive-demo"
    assert (tmp_path / archived).is_dir()
    assert not (tmp_path / rel).exists()
    assert not (tmp_path / ".agent-work" / "sessions" / ".current").exists()

    log = subprocess.run(
        ["git", "-C", str(tmp_path / ".agent-work"), "log", "-1", "--pretty=%s"],
        capture_output=True,
        text=True,
        check=True,
    )
    assert log.stdout.strip() == "chore(archive): Task-1-archive-demo"
