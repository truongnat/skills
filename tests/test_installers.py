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
