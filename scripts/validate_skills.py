#!/usr/bin/env python3
"""
Validate skills/*/SKILL.md: frontmatter `name` must match folder basename.
Uses skills/*/SKILL.md only (bundled top-level skills). Optional: --include-template.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def parse_name(text: str) -> str | None:
    if not text.startswith("---"):
        return None
    m = re.search(r"^name:\s*(.+)$", text, re.MULTILINE)
    if not m:
        return None
    return m.group(1).strip().strip("\"'")


def iter_skill_dirs(skills_dir: Path, include_template: bool) -> list[Path]:
    out: list[Path] = []
    for skill_md in sorted(skills_dir.glob("*/SKILL.md")):
        out.append(skill_md.parent)
    if include_template:
        for skill_md in sorted(skills_dir.glob("*/*/SKILL.md")):
            out.append(skill_md.parent)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate skill folder vs frontmatter name.")
    parser.add_argument("--include-template", action="store_true", help="Include examples/skill-template")
    args = parser.parse_args()

    skills_dir = repo_root() / "skills"
    errors: list[str] = []
    for d in iter_skill_dirs(skills_dir, args.include_template):
        rel = d.relative_to(skills_dir)
        skill_md = d / "SKILL.md"
        folder = d.name
        if not skill_md.is_file():
            errors.append(f"{rel}: missing SKILL.md")
            continue
        raw = skill_md.read_text(encoding="utf-8")
        name = parse_name(raw)
        if not name:
            errors.append(f"{rel}: no name: in frontmatter")
            continue
        if name != folder:
            errors.append(f"{rel}: frontmatter name={name!r} != folder={folder!r}")

    if errors:
        print("validate_skills: FAILED", file=sys.stderr)
        for e in errors:
            print(f"  {e}", file=sys.stderr)
        return 1
    print("validate_skills: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
