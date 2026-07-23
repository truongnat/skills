from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

import pytest


REPO_ROOT = Path(__file__).resolve().parents[1]

# Docs the installers copy into the host project. Keep fixtures in sync so
# install.sh / install.ps1 changes cannot silently break the installer suite.
INSTALLER_DOCS = (
    "AGENTS.md",
    "DESIGN_SYSTEM.md",
    "CODE_COMMENTS.md",
    "THIRD_PARTY_SKILLS.md",
    "SKILL_PREAMBLE.md",
    "AGENT_POLICY.md",
    "settings.yaml",
)


def make_source(tmp_path: Path) -> Path:
    shutil.copy2(REPO_ROOT / "install.sh", tmp_path / "install.sh")
    scripts = tmp_path / "scripts"
    scripts.mkdir(exist_ok=True)
    shutil.copy2(
        REPO_ROOT / "scripts" / "resolve_install_profile.py",
        scripts / "resolve_install_profile.py",
    )
    docs = tmp_path / "docs"
    docs.mkdir(exist_ok=True)
    (docs / "AGENTS.md").write_text("installed rules\n", encoding="utf-8")
    (docs / "DESIGN_SYSTEM.md").write_text("design\n", encoding="utf-8")
    (docs / "CODE_COMMENTS.md").write_text("comments\n", encoding="utf-8")
    (docs / "THIRD_PARTY_SKILLS.md").write_text(
        "licenses\n`expo-native-ui`\nopenai.yaml\n",
        encoding="utf-8",
    )
    (docs / "SKILL_PREAMBLE.md").write_text("preamble\n", encoding="utf-8")
    (docs / "AGENT_POLICY.md").write_text("policy\n", encoding="utf-8")
    (docs / "artifact-schemas.json").write_text(
        '{"version":1,"artifacts":{}}\n', encoding="utf-8"
    )
    (docs / "settings.yaml").write_text("language: en\n", encoding="utf-8")
    shutil.copy2(
        REPO_ROOT / "docs" / "install-profiles.json",
        docs / "install-profiles.json",
    )
    tools = tmp_path / "tools"
    tools.mkdir()
    (tools / "README.md").write_text("tools\n", encoding="utf-8")
    decision_server = tools / "decision-server"
    decision_server.mkdir()
    (decision_server / "server.py").write_text("# decision server\n", encoding="utf-8")
    (decision_server / "client.js").write_text("// client\n", encoding="utf-8")
    (decision_server / "animate.js").write_text("// animate\n", encoding="utf-8")
    (decision_server / "styles.css").write_text("/* styles */\n", encoding="utf-8")
    (decision_server / "tailwind-theme.js").write_text("tailwind.config = {};\n", encoding="utf-8")
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
    # Minimal skill set covering core + one third-party for profile pruning tests.
    for skill in ("planning", "execution", "init", "xlsx", "web-component-design"):
        root = tmp_path / "skills" / skill
        root.mkdir(parents=True)
        (root / "SKILL.md").write_text(f"# {skill}\n", encoding="utf-8")
    # Tiny profile doc for the fixture (not the full repo profiles).
    (docs / "install-profiles.json").write_text(
        """
{
  "version": 1,
  "default": "all",
  "profiles": {
    "core": {"skills": ["init", "planning", "execution"]},
    "office": {"includes": ["core"], "skills": ["xlsx"]},
    "frontend": {"includes": ["core"], "skills": ["web-component-design"]},
    "all": {"all_skills": true}
  }
}
""".strip()
        + "\n",
        encoding="utf-8",
    )
    return tmp_path


def run_installer(
    root: Path,
    mode: str,
    profile: str = "all",
) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["bash", "install.sh", "--agents-mode", mode, "--profile", profile],
        cwd=root,
        stdin=subprocess.DEVNULL,
        text=True,
        capture_output=True,
        check=True,
    )


def test_installer_docs_fixture_matches_scripts() -> None:
    """Fail when install scripts copy a docs file the fixture does not provide."""
    for installer in ("install.sh", "install.ps1"):
        text = (REPO_ROOT / installer).read_text(encoding="utf-8")
        for name in INSTALLER_DOCS:
            assert name in text, f"{installer} must reference docs/{name}"
            assert (REPO_ROOT / "docs" / name).is_file(), f"missing docs/{name}"


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
    assert (root / ".agents" / "SKILL_PREAMBLE.md").read_text(encoding="utf-8") == "preamble\n"
    assert (root / ".agents" / "AGENT_POLICY.md").read_text(encoding="utf-8") == "policy\n"
    assert (
        root / ".agents" / "tools" / "session" / "artifact-schemas.json"
    ).is_file()


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
    assert (decision_server / "animate.js").is_file()
    assert (decision_server / "styles.css").is_file()
    assert (decision_server / "tailwind-theme.js").is_file()
    assert (root / ".agents" / "DESIGN_SYSTEM.md").read_text(encoding="utf-8") == "design\n"
    assert (root / ".agents" / "CODE_COMMENTS.md").read_text(encoding="utf-8") == "comments\n"
    assert (root / ".agents" / "THIRD_PARTY_SKILLS.md").read_text(
        encoding="utf-8"
    ).startswith("licenses\n")
    assert (root / ".agents" / "SKILL_PREAMBLE.md").read_text(encoding="utf-8") == "preamble\n"
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


def test_installer_default_profile_is_core_without_flag(tmp_path: Path) -> None:
    root = make_source(tmp_path)
    subprocess.run(
        ["bash", "install.sh", "--agents-mode", "replace"],
        cwd=root,
        stdin=subprocess.DEVNULL,
        text=True,
        capture_output=True,
        check=True,
    )
    skills = {p.name for p in (root / ".agents" / "skills").iterdir() if p.is_dir()}
    assert skills == {"init", "planning", "execution"}
    assert "xlsx" not in skills


def test_profile_core_installs_subset_and_prunes(tmp_path: Path) -> None:
    root = make_source(tmp_path)
    run_installer(root, "replace", profile="all")
    assert (root / ".agents" / "skills" / "xlsx").is_dir()
    assert (root / ".agents" / "skills" / "web-component-design").is_dir()

    run_installer(root, "replace", profile="core")

    skills = {p.name for p in (root / ".agents" / "skills").iterdir() if p.is_dir()}
    assert skills == {"init", "planning", "execution"}


def test_profile_office_unions_core(tmp_path: Path) -> None:
    root = make_source(tmp_path)
    run_installer(root, "replace", profile="office")
    skills = {p.name for p in (root / ".agents" / "skills").iterdir() if p.is_dir()}
    assert skills == {"init", "planning", "execution", "xlsx"}
