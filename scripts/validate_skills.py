#!/usr/bin/env python3
"""Validate the repository's first-party/vendored skill architecture."""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS_ROOT = ROOT / "skills"
FIRST_PARTY = {
    "init",
    "brainstorming",
    "business-analysis",
    "basic-design",
    "detail-design",
    "planning",
    "sync",
    "execution",
    "review",
    "done",
    "investigate",
    "research",
    "review-pr",
    "tester",
    "xlsx",
    "docx",
    "pptx",
    "pdf",
}
REQUIRED_METADATA_KEYS = (
    "display_name:",
    "short_description:",
    "default_prompt:",
    "required_input:",
    "required_output:",
    "note_important:",
    "artifacts:",
)
REPORT_SKILLS = {
    "init",
    "brainstorming",
    "business-analysis",
    "basic-design",
    "detail-design",
    "planning",
    "sync",
    "execution",
    "review",
    "done",
    "investigate",
    "research",
    "review-pr",
    "tester",
}


def frontmatter(text: str) -> str | None:
    if not text.startswith("---\n"):
        return None
    end = text.find("\n---", 4)
    return None if end < 0 else text[4:end]


def main() -> int:
    errors: list[str] = []
    third_party_notice = (ROOT / "docs" / "THIRD_PARTY_SKILLS.md").read_text(
        encoding="utf-8"
    )

    for skill_dir in sorted(path for path in SKILLS_ROOT.iterdir() if path.is_dir()):
        name = skill_dir.name
        if name == "office-common":
            continue
        skill_md = skill_dir / "SKILL.md"
        if not skill_md.is_file():
            errors.append(f"{name}: missing SKILL.md")
            continue
        text = skill_md.read_text(encoding="utf-8")
        metadata = frontmatter(text)
        if metadata is None:
            errors.append(f"{name}: missing/invalid YAML frontmatter")
        else:
            match = re.search(r"^name:\s*[\"']?([^\"'\n]+)", metadata, re.MULTILINE)
            if not match or match.group(1).strip() != name:
                errors.append(f"{name}: frontmatter name must match directory")
            if not re.search(r"^description:\s*\S+", metadata, re.MULTILINE):
                errors.append(f"{name}: missing description")

        if name in FIRST_PARTY:
            if "## Contract (mandatory)" not in text:
                errors.append(f"{name}: missing mandatory Contract")
            yaml_path = skill_dir / "agents" / "openai.yaml"
            if not yaml_path.is_file():
                errors.append(f"{name}: missing agents/openai.yaml")
                continue
            yaml_text = yaml_path.read_text(encoding="utf-8")
            for key in REQUIRED_METADATA_KEYS:
                if key not in yaml_text:
                    errors.append(f"{name}: openai.yaml missing {key[:-1]}")
            if name in REPORT_SKILLS:
                if "executive_summary:" not in yaml_text:
                    errors.append(f"{name}: report schema missing executive_summary")
                if "context_5w1h:" not in yaml_text:
                    errors.append(f"{name}: report schema missing context_5w1h")
        elif f"`{name}`" not in third_party_notice:
            errors.append(f"{name}: vendored skill missing third-party attribution")

    init_required = (
        SKILLS_ROOT / "init" / "templates" / "PRJ_REFERENCE.template.md"
    )
    if not init_required.is_file():
        errors.append("init: missing PRJ_REFERENCE.template.md")

    agents = (ROOT / "docs" / "AGENTS.md").read_text(encoding="utf-8")
    for required in (
        ".agents/settings.yaml",
        ".agents/PRJ_REFERENCE.md",
        "BUSINESS_ANALYSIS.md",
        "TESTCASES.md",
    ):
        if required not in agents:
            errors.append(f"docs/AGENTS.md missing architecture reference: {required}")

    if errors:
        print("SKILL_VALIDATION_FAILED")
        for error in errors:
            print(f"- {error}")
        return 1
    print("SKILL_VALIDATION_OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
