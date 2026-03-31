#!/usr/bin/env python3
"""
Install a custom Cursor skill into an existing project, with isolation defaults.

Isolation behavior:
- installs into <project>/.cursor/skills/<skill-name>
- records install metadata under <project>/.cursor/skills/.install-manifest/
- adds installed path to <project>/.git/info/exclude (unless disabled)
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path


def parse_skill_name(skill_md_text: str) -> str | None:
    if not skill_md_text.startswith("---"):
        return None
    match = re.search(r"^name:\s*(.+)$", skill_md_text, re.MULTILINE)
    if not match:
        return None
    return match.group(1).strip().strip("\"'")


def validate_skill_dir(skill_dir: Path) -> tuple[str, Path]:
    skill_md = skill_dir / "SKILL.md"
    if not skill_dir.is_dir():
        raise ValueError(f"Skill directory does not exist: {skill_dir}")
    if not skill_md.is_file():
        raise ValueError(f"Missing SKILL.md in skill directory: {skill_dir}")
    name = parse_skill_name(skill_md.read_text(encoding="utf-8"))
    if not name:
        raise ValueError("SKILL.md must include frontmatter with a 'name' field.")
    return name, skill_md


def ensure_git_exclude(project_dir: Path, rel_skill_path: str) -> None:
    info_dir = project_dir / ".git" / "info"
    exclude_file = info_dir / "exclude"
    if not info_dir.is_dir():
        return
    info_dir.mkdir(parents=True, exist_ok=True)
    existing = ""
    if exclude_file.exists():
        existing = exclude_file.read_text(encoding="utf-8")
    line = f"{rel_skill_path.rstrip('/')}/"
    if line in existing.splitlines():
        return
    if existing and not existing.endswith("\n"):
        existing += "\n"
    existing += f"{line}\n"
    exclude_file.write_text(existing, encoding="utf-8")


def remove_path(path: Path) -> None:
    if not path.exists() and not path.is_symlink():
        return
    if path.is_symlink() or path.is_file():
        path.unlink()
        return
    shutil.rmtree(path)


def install_skill(
    *,
    skill_dir: Path,
    project_dir: Path,
    install_name: str,
    mode: str,
    force: bool,
    isolate_git: bool,
) -> Path:
    target_dir = project_dir / ".cursor" / "skills" / install_name
    target_parent = target_dir.parent
    target_parent.mkdir(parents=True, exist_ok=True)

    if target_dir.exists() or target_dir.is_symlink():
        if not force:
            raise ValueError(
                f"Target already exists: {target_dir}. Use --force to replace it."
            )
        remove_path(target_dir)

    installed_mode = mode
    if mode == "symlink":
        try:
            target_dir.symlink_to(skill_dir.resolve(), target_is_directory=True)
        except OSError as exc:
            raise ValueError(
                "Symlink creation failed. On Windows, enable Developer Mode or "
                "run terminal with sufficient privileges; or use --mode copy."
            ) from exc
    else:
        shutil.copytree(skill_dir, target_dir)

    manifest_dir = target_parent / ".install-manifest"
    manifest_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = manifest_dir / f"{install_name}.json"
    manifest = {
        "installed_at": datetime.now(timezone.utc).isoformat(),
        "mode": installed_mode,
        "skill_name": install_name,
        "source": str(skill_dir.resolve()),
        "target": str(target_dir.resolve()),
    }
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    if isolate_git:
        rel_skill_path = f".cursor/skills/{install_name}"
        ensure_git_exclude(project_dir, rel_skill_path)

    return target_dir


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Install a custom Cursor skill into an existing project."
    )
    parser.add_argument(
        "--skill-dir",
        required=True,
        help="Path to your skill folder (must contain SKILL.md).",
    )
    parser.add_argument(
        "--project-dir",
        required=True,
        help="Path to existing target project.",
    )
    parser.add_argument(
        "--name",
        help="Override installed folder name. Default uses SKILL.md frontmatter name.",
    )
    parser.add_argument(
        "--mode",
        choices=["symlink", "copy"],
        default="symlink",
        help="Install mode. symlink keeps source isolated and single-copy.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Replace target if it already exists.",
    )
    parser.add_argument(
        "--no-git-isolation",
        action="store_true",
        help="Do not write .cursor/skills/<name>/ into .git/info/exclude.",
    )
    args = parser.parse_args()

    skill_dir = Path(args.skill_dir).expanduser().resolve()
    project_dir = Path(args.project_dir).expanduser().resolve()
    if not project_dir.is_dir():
        print(f"Project directory does not exist: {project_dir}", file=sys.stderr)
        return 1

    try:
        parsed_name, _skill_md = validate_skill_dir(skill_dir)
        install_name = args.name or parsed_name
        target = install_skill(
            skill_dir=skill_dir,
            project_dir=project_dir,
            install_name=install_name,
            mode=args.mode,
            force=args.force,
            isolate_git=not args.no_git_isolation,
        )
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 2

    print(f"Installed skill '{install_name}' at: {target}")
    print(f"Mode: {args.mode}")
    if not args.no_git_isolation:
        print("Git isolation: added target path to .git/info/exclude")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
