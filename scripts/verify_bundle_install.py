#!/usr/bin/env python3
"""
Sanity-check a full own-skills install in *another* project (after remote or local --full install).

Checks:
  - vendor/own-skills/.own-skills-bundle exists
  - bundled skills tree and validate_skills.py
  - .cursor/skills entries (symlinks should resolve under vendor/own-skills)

Does not replace IDE-specific testing; run from the target project root (or pass --project-dir).
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Verify full bundle install (vendor + Cursor skills) in a target project.",
    )
    parser.add_argument(
        "--project-dir",
        type=Path,
        default=Path.cwd(),
        help="Target project root (default: current directory)",
    )
    parser.add_argument(
        "--skip-validate-skills",
        action="store_true",
        help="Do not run scripts/validate_skills.py inside the vendor tree",
    )
    args = parser.parse_args()

    project: Path = args.project_dir.resolve()
    vendor = project / "vendor" / "own-skills"
    marker = vendor / ".own-skills-bundle"
    errors: list[str] = []

    if not marker.is_file():
        errors.append(
            f"Missing {marker} — not a full bundle install, or wrong --project-dir (expected project root).",
        )
        _print_result(errors)
        return 1

    if not (vendor / "install.sh").is_file():
        errors.append(f"Missing {vendor / 'install.sh'} — vendor tree looks incomplete.")

    skills_under_vendor = vendor / "skills"
    if not skills_under_vendor.is_dir():
        errors.append(f"Missing {skills_under_vendor}")
    else:
        skill_mds = list(skills_under_vendor.glob("*/SKILL.md"))
        if not skill_mds:
            errors.append(f"No bundled skills under {skills_under_vendor}")

    cursor_skills = project / ".cursor" / "skills"
    if not cursor_skills.is_dir():
        errors.append(f"Missing {cursor_skills} — skills may not have been installed.")
    else:
        entries = [
            p
            for p in cursor_skills.iterdir()
            if p.name != ".install-manifest" and not p.name.startswith(".")
        ]
        if not entries:
            errors.append(f"{cursor_skills} is empty (excluding manifest).")
        else:
            vendor_resolved = vendor.resolve()
            broken = 0
            outside = 0
            for p in entries:
                if p.is_symlink():
                    try:
                        target = p.resolve()
                    except OSError:
                        broken += 1
                        continue
                    try:
                        target.relative_to(vendor_resolved)
                    except ValueError:
                        outside += 1
                elif p.is_dir():
                    # copy mode: cannot assert path; skip
                    pass
            if broken:
                errors.append(f"{broken} skill link(s) under .cursor/skills are broken.")
            if outside:
                errors.append(
                    f"{outside} skill symlink(s) resolve outside {vendor_resolved} (unexpected for bundle install).",
                )

    validate_script = vendor / "scripts" / "validate_skills.py"
    if not args.skip_validate_skills and validate_script.is_file():
        r = subprocess.run(
            [os.environ.get("PYTHON", sys.executable), str(validate_script)],
            cwd=str(vendor),
            capture_output=True,
            text=True,
        )
        if r.returncode != 0:
            errors.append("scripts/validate_skills.py failed in vendor tree.")
            if r.stdout:
                print(r.stdout, end="")
            if r.stderr:
                print(r.stderr, end="", file=sys.stderr)

    _print_result(errors)
    return 0 if not errors else 1


def _print_result(errors: list[str]) -> None:
    if errors:
        print("verify_bundle_install: FAILED", file=sys.stderr)
        for e in errors:
            print(f"  {e}", file=sys.stderr)
    else:
        print("verify_bundle_install: OK (full bundle + .cursor/skills present; validate_skills passed)")


if __name__ == "__main__":
    raise SystemExit(main())
