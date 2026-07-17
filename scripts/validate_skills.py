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
                # 5W1H is an on-demand diagnostic method, not a required report
                # field; it must not be stamped into artifact schemas.
                if "context_5w1h:" in yaml_text:
                    errors.append(f"{name}: report schema must not include context_5w1h (5W1H is a method, not a default section)")
        elif f"`{name}`" not in third_party_notice:
            errors.append(f"{name}: vendored skill missing third-party attribution")

    init_required = (
        SKILLS_ROOT / "init" / "templates" / "PRJ_REFERENCE.template.md"
    )
    if not init_required.is_file():
        errors.append("init: missing PRJ_REFERENCE.template.md")

    visual_template = (
        SKILLS_ROOT
        / "brainstorming"
        / "templates"
        / "VISUAL_DECISION.template.html"
    )
    if not visual_template.is_file():
        errors.append("brainstorming: missing VISUAL_DECISION.template.html")
    else:
        visual_html = visual_template.read_text(encoding="utf-8")
        if "cdn.tailwindcss.com" not in visual_html:
            errors.append("VISUAL_DECISION.template.html missing Tailwind CDN")
        if "animejs@3.2.2" not in visual_html:
            errors.append("VISUAL_DECISION.template.html missing anime.js CDN")
        if "Do not open this file via file://" in visual_html:
            errors.append(
                "VISUAL_DECISION.template.html must support static open (remove file:// hard block)"
            )
    for name, required_fields in {
        "brainstorming": (
            "issue_triage:",
            "clarification_checkpoint:",
            "spec_quality_review:",
            "step_ledger:",
            "visual_triage:",
            "developer_overview:",
        ),
        "planning": (
            "pre_planning_decision_gate:",
            "clarification_questions:",
            "spec_quality_review:",
            "step_ledger:",
            "visual_triage:",
            "developer_overview:",
        ),
        "business-analysis": (
            "spec_quality_review:",
            "step_ledger:",
            "open_questions:",
            "developer_overview:",
        ),
    }.items():
        yaml_text = (
            SKILLS_ROOT / name / "agents" / "openai.yaml"
        ).read_text(encoding="utf-8")
        for field in required_fields:
            if field not in yaml_text:
                errors.append(f"{name}: decision gate missing {field[:-1]}")

    discussion_template = (
        SKILLS_ROOT / "brainstorming" / "templates" / "DISCUSSION.template.md"
    ).read_text(encoding="utf-8")
    if "Spec quality review" not in discussion_template:
        errors.append("brainstorming DISCUSSION template missing Spec quality review")
    if "Step ledger" not in discussion_template:
        errors.append("brainstorming DISCUSSION template missing Step ledger")
    if "Feasibility" not in discussion_template or "Correctness" not in discussion_template:
        errors.append("brainstorming DISCUSSION template missing Feasibility/Correctness")
    if "Capability recommendations" not in discussion_template:
        errors.append("brainstorming DISCUSSION template missing Capability recommendations")
    sq_d = discussion_template.find("## Spec quality review")
    scope_d = discussion_template.find("## Scope in")
    if sq_d < 0 or scope_d < 0 or sq_d > scope_d:
        errors.append("brainstorming DISCUSSION: Spec quality review must appear before Scope in")
    plan_template = (
        SKILLS_ROOT / "planning" / "templates" / "PLAN.template.md"
    ).read_text(encoding="utf-8")
    if "Spec quality review" not in plan_template:
        errors.append("planning PLAN template missing Spec quality review")
    if "Step ledger" not in plan_template:
        errors.append("planning PLAN template missing Step ledger")
    sq_p = plan_template.find("## Spec quality review")
    goal_p = plan_template.find("## Goal")
    if sq_p < 0 or goal_p < 0 or sq_p > goal_p:
        errors.append("planning PLAN: Spec quality review must appear before Goal")
    ba_template = (
        SKILLS_ROOT / "business-analysis" / "templates" / "BUSINESS_ANALYSIS.template.md"
    )
    if not ba_template.is_file():
        errors.append("business-analysis missing BUSINESS_ANALYSIS.template.md")
    else:
        ba_template_text = ba_template.read_text(encoding="utf-8")
        if "Spec quality review" not in ba_template_text or "Step ledger" not in ba_template_text:
            errors.append("business-analysis template missing Spec quality review / Step ledger")
        # Spec quality must appear before stories so agents cannot fill AC first
        sq_pos = ba_template_text.find("## Spec quality review")
        us_pos = ba_template_text.find("## User stories")
        if sq_pos < 0 or us_pos < 0 or sq_pos > us_pos:
            errors.append(
                "business-analysis template: Spec quality review must appear before User stories"
            )
    for ba_step in (
        "step-01-init.md",
        "step-02-frame-quality.md",
        "step-03-stories-rules-ac.md",
        "step-04-self-check.md",
    ):
        if not (SKILLS_ROOT / "business-analysis" / "steps" / ba_step).is_file():
            errors.append(f"business-analysis missing steps/{ba_step}")
    for skill_name, step_names in {
        "brainstorming": (
            "step-01-init.md",
            "step-02-frame.md",
            "step-03-scope-options.md",
            "step-04-recommend.md",
            "step-05-self-check.md",
        ),
        "planning": (
            "step-01-init.md",
            "step-02-fill-plan.md",
            "step-03-fill-tasks.md",
            "step-04-self-check.md",
        ),
    }.items():
        for step_name in step_names:
            step_path = SKILLS_ROOT / skill_name / "steps" / step_name
            if not step_path.is_file():
                errors.append(f"{skill_name} missing steps/{step_name}")
                continue
            step_text = step_path.read_text(encoding="utf-8")
            if "Precondition" not in step_text:
                errors.append(f"{skill_name}/{step_name} missing Precondition gate")
            if "Spec quality" not in step_text and step_name in {
                "step-02-frame.md",
                "step-02-fill-plan.md",
                "step-03-scope-options.md",
                "step-03-fill-tasks.md",
                "step-04-recommend.md",
                "step-04-self-check.md",
                "step-05-self-check.md",
            }:
                errors.append(f"{skill_name}/{step_name} missing Spec quality enforcement")
    for ba_step_name in (
        "step-01-init.md",
        "step-02-frame-quality.md",
        "step-03-stories-rules-ac.md",
        "step-04-self-check.md",
    ):
        ba_step_path = SKILLS_ROOT / "business-analysis" / "steps" / ba_step_name
        if ba_step_path.is_file():
            ba_step_text = ba_step_path.read_text(encoding="utf-8")
            if ba_step_name != "step-01-init.md" and "Spec quality" not in ba_step_text:
                errors.append(f"business-analysis/{ba_step_name} missing Spec quality enforcement")
            if "Precondition" not in ba_step_text:
                errors.append(f"business-analysis/{ba_step_name} missing Precondition gate")
            if "Step ledger" not in ba_step_text:
                errors.append(f"business-analysis/{ba_step_name} missing Step ledger update")
    ba_skill = (SKILLS_ROOT / "business-analysis" / "SKILL.md").read_text(encoding="utf-8")
    if "spec_quality_review" not in ba_skill:
        errors.append("business-analysis missing spec_quality_review contract")
    if "step-01-init.md" not in ba_skill:
        errors.append("business-analysis SKILL.md missing step workflow entry")
    if "Step ledger" not in ba_skill:
        errors.append("business-analysis SKILL.md missing Step ledger")
    for overview_template in (
        SKILLS_ROOT / "brainstorming" / "templates" / "OVERVIEW.template.md",
        SKILLS_ROOT / "planning" / "templates" / "OVERVIEW.template.md",
    ):
        if not overview_template.is_file():
            errors.append(f"missing overview template: {overview_template}")
    agents = (ROOT / "docs" / "AGENTS.md").read_text(encoding="utf-8")
    if "Spec quality review" not in agents and "Capability recommendations" not in agents:
        errors.append("docs/AGENTS.md missing Spec quality review gates")
    if "Step ledger" not in agents:
        errors.append("docs/AGENTS.md missing Step ledger enforcement")
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    for phrase in ("Spec quality", "Step ledger", "business-analysis"):
        if phrase not in readme:
            errors.append(f"README.md missing workflow documentation: {phrase}")
    settings = (ROOT / "docs" / "settings.yaml").read_text(encoding="utf-8")
    for setting in (
        "require_sequential_step_ledger: true",
        "require_spec_quality_before_downstream_work: true",
        "blocking-capability-gap",
    ):
        if setting not in settings:
            errors.append(f"docs/settings.yaml missing decision policy: {setting}")
    if "Developer UX / DX" not in agents:
        errors.append("docs/AGENTS.md missing Developer UX / DX section")
    settings = (ROOT / "docs" / "settings.yaml").read_text(encoding="utf-8")
    if "session_overview: required" not in settings:
        errors.append("docs/settings.yaml missing session_overview setting")
    if "output_format: markdown" not in settings:
        errors.append("docs/settings.yaml missing default report output_format")
    if "## Artifact format resolution" not in agents:
        errors.append("docs/AGENTS.md missing artifact format resolution rules")
    design_system = (ROOT / "docs" / "DESIGN_SYSTEM.md").read_text(encoding="utf-8")
    if "cdn.tailwindcss.com" not in design_system and "ss-card" not in design_system:
        errors.append("docs/DESIGN_SYSTEM.md missing Tailwind CDN / ss-card enterprise theme")
    if "Dual load mode" not in design_system:
        errors.append("docs/DESIGN_SYSTEM.md missing Dual load mode guidance")
    if "Always include Tailwind CDN" not in design_system:
        errors.append("docs/DESIGN_SYSTEM.md missing mandatory CDN agent rule")
    if "astryx.atmeta.com" in design_system.lower():
        errors.append("docs/DESIGN_SYSTEM.md must not depend on Astryx")
    decision_dir = ROOT / "tools" / "decision-server"
    if not (decision_dir / "styles.css").is_file():
        errors.append("tools/decision-server/styles.css missing")
    if not (decision_dir / "tailwind-theme.js").is_file():
        errors.append("tools/decision-server/tailwind-theme.js missing")
    if not (decision_dir / "animate.js").is_file():
        errors.append("tools/decision-server/animate.js missing")
    if "DESIGN_SYSTEM.md" not in agents:
        errors.append("docs/AGENTS.md missing DESIGN_SYSTEM reference")
    styles = (decision_dir / "styles.css").read_text(encoding="utf-8")
    if "--ss-interactive:" not in styles or "--ss-background:" not in styles:
        errors.append("tools/decision-server/styles.css missing shared --ss-* tokens")
    if "#10a37f" not in styles:
        errors.append("tools/decision-server/styles.css missing Apps SDK accent token")
    theme_js = (decision_dir / "tailwind-theme.js").read_text(encoding="utf-8")
    if "tailwind.config" not in theme_js:
        errors.append("tools/decision-server/tailwind-theme.js missing enterprise palette")
    animate_js = (decision_dir / "animate.js").read_text(encoding="utf-8")
    if "SimpleSkillsAnimate" not in animate_js or "data-ss-animate" not in animate_js:
        errors.append("tools/decision-server/animate.js missing illustration helpers")
    if "animejs" not in design_system:
        errors.append("docs/DESIGN_SYSTEM.md missing anime.js illustration guidance")
    if "ss-card" not in design_system or "token" not in design_system.lower():
        errors.append("docs/DESIGN_SYSTEM.md missing compact ss-* / token guidance")
    if "frontend-design" not in design_system and "Apps SDK" not in design_system:
        errors.append("docs/DESIGN_SYSTEM.md missing Claude/OpenAI guideline attribution")
    if "ss-prose" not in design_system and "semantic" not in design_system.lower():
        errors.append("docs/DESIGN_SYSTEM.md missing semantic/reading-first guidance")

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
