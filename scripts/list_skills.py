#!/usr/bin/env python3
"""
List bundled skills: skills/*/SKILL.md (one level under skills/).
Optional: --include-template adds skills/examples/skill-template/SKILL.md.
Fast inventory — no ML.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def parse_frontmatter_name(text: str) -> str | None:
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
    parser = argparse.ArgumentParser(description="List skill folders and SKILL.md name field.")
    parser.add_argument(
        "--include-template",
        action="store_true",
        help="Include examples/skill-template",
    )
    parser.add_argument("--json", action="store_true", help="Print JSON array")
    args = parser.parse_args()

    skills_dir = repo_root() / "skills"
    rows: list[dict] = []
    for d in iter_skill_dirs(skills_dir, args.include_template):
        rel = d.relative_to(skills_dir)
        skill_md = d / "SKILL.md"
        name = None
        if skill_md.is_file():
            raw = skill_md.read_text(encoding="utf-8")
            name = parse_frontmatter_name(raw)
        rows.append(
            {
                "folder": str(rel).replace("\\", "/"),
                "name": name,
                "has_skill_md": skill_md.is_file(),
            }
        )

    if args.json:
        json.dump(rows, sys.stdout, ensure_ascii=False, indent=2)
        sys.stdout.write("\n")
        return 0

    for r in rows:
        nm = r["name"] or "(missing name)"
        ok = "OK" if r["has_skill_md"] else "MISSING SKILL.md"
        print(f"{r['folder']}\t{nm}\t{ok}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
