#!/usr/bin/env python3
"""Resolve install profile names to a sorted list of skill directory names."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def load_profiles(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def resolve(profiles_doc: dict, names: list[str], skills_root: Path) -> list[str]:
    profiles = profiles_doc["profiles"]
    selected: set[str] = set()
    seen: set[str] = set()

    def add_profile(name: str) -> None:
        if name in seen:
            return
        if name not in profiles:
            raise SystemExit(f"Unknown install profile: {name}")
        seen.add(name)
        profile = profiles[name]
        if profile.get("all_skills"):
            for child in skills_root.iterdir():
                if child.is_dir():
                    selected.add(child.name)
            return
        for inc in profile.get("includes") or []:
            add_profile(inc)
        for skill in profile.get("skills") or []:
            selected.add(skill)

    for name in names:
        add_profile(name.strip())
    return sorted(selected)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--profile",
        default=None,
        help="Comma-separated profile names (default: from install-profiles.json)",
    )
    parser.add_argument(
        "--source",
        type=Path,
        required=True,
        help="Path to simple-skills source root",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Validate every resolved skill exists under skills/",
    )
    args = parser.parse_args()
    source = args.source.resolve()
    profiles_path = source / "docs" / "install-profiles.json"
    skills_root = source / "skills"
    if not profiles_path.is_file():
        print(f"Missing {profiles_path}", file=sys.stderr)
        return 2
    profiles_doc = load_profiles(profiles_path)
    if args.profile:
        names = [p for p in args.profile.split(",") if p.strip()]
    else:
        names = [profiles_doc.get("default", "core")]
    if not names:
        names = [profiles_doc.get("default", "core")]
    skills = resolve(profiles_doc, names, skills_root)
    if args.check:
        missing = [s for s in skills if not (skills_root / s).is_dir()]
        if missing:
            print("Missing skill dirs: " + ", ".join(missing), file=sys.stderr)
            return 1
    for skill in skills:
        print(skill)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
