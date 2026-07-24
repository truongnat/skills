#!/usr/bin/env python3
"""Validate first-party office skill layout and contracts."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS = ("xlsx", "docx", "pptx", "pdf")
CONVERT_SKILLS = ("excel-doc-convert",)
REQUIRED = (
    "SKILL.md",
    "agents/openai.yaml",
    "requirements.txt",
    "references/COVERAGE.md",
    "scripts/cli.py",
    "scripts/setup.py",
)
CONVERT_REQUIRED = (
    "SKILL.md",
    "agents/openai.yaml",
    "requirements.txt",
    "references/METHODS.md",
    "references/JP_TEMPLATES.md",
    "scripts/cli.py",
    "scripts/setup.py",
)


def main() -> int:
    errors: list[str] = []
    common = ROOT / "skills" / "office-common" / "python" / "office_common"
    if not common.is_dir():
        errors.append(f"missing office-common package at {common}")
    requirements = ROOT / "requirements-office.txt"
    if requirements.exists():
        errors.append("obsolete centralized requirements-office.txt still present")
    if (ROOT / "skills" / "office-mcp").exists():
        errors.append("obsolete skills/office-mcp still present")

    for installer in ("install.sh", "install.ps1"):
        text = (ROOT / installer).read_text(encoding="utf-8")
        if "requirements-office.txt" in text or "-m venv" in text:
            errors.append(f"{installer} must not install Office dependencies eagerly")

    for skill in SKILLS:
        root = ROOT / "skills" / skill
        for rel in REQUIRED:
            path = root / rel
            if not path.is_file():
                errors.append(f"missing {path}")
        skill_md = (root / "SKILL.md").read_text(encoding="utf-8") if (root / "SKILL.md").is_file() else ""
        if "coverage_ratio" not in skill_md and "supported-lossless" not in skill_md.lower():
            errors.append(f"{skill}/SKILL.md missing coverage contract wording")
        if f"skills/{skill}/scripts/setup.py" not in skill_md:
            errors.append(f"{skill}/SKILL.md missing on-demand setup command")
        yaml_text = (
            (root / "agents" / "openai.yaml").read_text(encoding="utf-8")
            if (root / "agents" / "openai.yaml").is_file()
            else ""
        )
        for key in ("required_input", "required_output", "note_important"):
            if f"{key}:" not in yaml_text:
                errors.append(f"{skill}/agents/openai.yaml missing {key}")

    for skill in CONVERT_SKILLS:
        root = ROOT / "skills" / skill
        for rel in CONVERT_REQUIRED:
            path = root / rel
            if not path.is_file():
                errors.append(f"missing {path}")
        skill_md = (root / "SKILL.md").read_text(encoding="utf-8") if (root / "SKILL.md").is_file() else ""
        if "convert-report.json" not in skill_md:
            errors.append(f"{skill}/SKILL.md missing convert-report.json contract")
        if "rowspan" not in skill_md.lower() and "HTML" not in skill_md:
            errors.append(f"{skill}/SKILL.md must mention HTML intermediate")
        if f"skills/{skill}/scripts/setup.py" not in skill_md:
            errors.append(f"{skill}/SKILL.md missing on-demand setup command")
        yaml_text = (
            (root / "agents" / "openai.yaml").read_text(encoding="utf-8")
            if (root / "agents" / "openai.yaml").is_file()
            else ""
        )
        for key in ("required_input", "required_output", "note_important"):
            if f"{key}:" not in yaml_text:
                errors.append(f"{skill}/agents/openai.yaml missing {key}")

    if errors:
        print("OFFICE_SKILL_VALIDATION_FAILED")
        for err in errors:
            print(f"- {err}")
        return 1
    print("OFFICE_SKILL_VALIDATION_OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
