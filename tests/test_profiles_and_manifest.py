from __future__ import annotations

import json
import subprocess
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]


def test_resolve_all_profile_lists_every_skill_dir() -> None:
    result = subprocess.run(
        [
            "python3",
            str(REPO_ROOT / "scripts" / "resolve_install_profile.py"),
            "--source",
            str(REPO_ROOT),
            "--profile",
            "all",
            "--check",
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    skills = {line for line in result.stdout.splitlines() if line.strip()}
    on_disk = {
        p.name
        for p in (REPO_ROOT / "skills").iterdir()
        if p.is_dir()
    }
    assert skills == on_disk


def test_resolve_core_is_subset_of_all() -> None:
    core = subprocess.run(
        [
            "python3",
            str(REPO_ROOT / "scripts" / "resolve_install_profile.py"),
            "--source",
            str(REPO_ROOT),
            "--profile",
            "core",
            "--check",
        ],
        check=True,
        capture_output=True,
        text=True,
    ).stdout.splitlines()
    profiles = json.loads(
        (REPO_ROOT / "docs" / "install-profiles.json").read_text(encoding="utf-8")
    )
    assert set(core) == set(profiles["profiles"]["core"]["skills"])
    assert "xlsx" not in core
    assert "web-component-design" not in core


def test_first_party_manifest_covers_disk_first_party() -> None:
    manifest = json.loads(
        (REPO_ROOT / "docs" / "first-party-skills.json").read_text(encoding="utf-8")
    )
    names = {entry["name"] for entry in manifest["skills"]}
    assert "planning" in names
    assert "xlsx" in names
    assert "expo-native-ui" not in names
    assert set(manifest["third_party_metadata_allowed"]) == {
        "expo-native-ui",
        "expo-data-fetching",
    }
