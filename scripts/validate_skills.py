#!/usr/bin/env python3
"""Validate the repository's first-party/vendored skill architecture."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS_ROOT = ROOT / "skills"
MANIFEST_PATH = ROOT / "docs" / "first-party-skills.json"
PROFILES_PATH = ROOT / "docs" / "install-profiles.json"
REQUIRED_METADATA_KEYS = (
    "display_name:",
    "short_description:",
    "default_prompt:",
    "required_input:",
    "required_output:",
    "note_important:",
    "artifacts:",
)
PREAMBLE_MARKER = ".agents/SKILL_PREAMBLE.md"
CONTRACT_HEADING = "## Contract (mandatory)"


def frontmatter(text: str) -> str | None:
    if not text.startswith("---\n"):
        return None
    end = text.find("\n---", 4)
    return None if end < 0 else text[4:end]


def load_manifest() -> dict:
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def contract_has_fields(text: str, fields: list[str]) -> list[str]:
    missing: list[str] = []
    contract_pos = text.find(CONTRACT_HEADING)
    if contract_pos < 0:
        return list(fields)
    # Limit search to the contract table region (until next top-level ## or EOF)
    rest = text[contract_pos:]
    next_h2 = re.search(r"\n## (?!#)", rest[len(CONTRACT_HEADING) :])
    region = rest if next_h2 is None else rest[: len(CONTRACT_HEADING) + next_h2.start()]
    for field in fields:
        if f"| {field} |" not in region and f"|{field}|" not in region:
            missing.append(field)
    return missing


def main() -> int:
    errors: list[str] = []
    if not MANIFEST_PATH.is_file():
        print("SKILL_VALIDATION_FAILED")
        print(f"- missing {MANIFEST_PATH}")
        return 1

    manifest = load_manifest()
    first_party = {entry["name"] for entry in manifest["skills"]}
    helpers = set(manifest.get("helpers") or [])
    report_skills = set(manifest.get("report_skills") or [])
    step_skills: dict[str, list[str]] = manifest.get("step_skills") or {}
    preamble_required = set(manifest.get("preamble_required_for") or [])
    contract_fields = list(manifest.get("contract_table_fields") or ["Inputs", "Outputs", "Safety"])
    third_party_meta_ok = set(manifest.get("third_party_metadata_allowed") or [])

    for name in first_party:
        if not (SKILLS_ROOT / name).is_dir():
            errors.append(f"manifest skill missing on disk: {name}")
    for name in helpers:
        if not (SKILLS_ROOT / name).is_dir():
            errors.append(f"manifest helper missing on disk: {name}")
    for name in report_skills:
        if name not in first_party:
            errors.append(f"report_skills entry not in first_party: {name}")
    for name in step_skills:
        if name not in first_party:
            errors.append(f"step_skills entry not in first_party: {name}")

    third_party_notice = (ROOT / "docs" / "THIRD_PARTY_SKILLS.md").read_text(
        encoding="utf-8"
    )
    if "agents/openai.yaml" not in third_party_notice and "openai.yaml" not in third_party_notice:
        errors.append(
            "docs/THIRD_PARTY_SKILLS.md must document third-party openai.yaml metadata exception"
        )

    preamble = ROOT / "docs" / "SKILL_PREAMBLE.md"
    if not preamble.is_file():
        errors.append("docs/SKILL_PREAMBLE.md missing")
    else:
        preamble_text = preamble.read_text(encoding="utf-8")
        if "## Language (do this first)" not in preamble_text:
            errors.append("SKILL_PREAMBLE.md missing Language section")
        if "## Memory (read first)" not in preamble_text:
            errors.append("SKILL_PREAMBLE.md missing Memory section")

    if not PROFILES_PATH.is_file():
        errors.append(f"missing {PROFILES_PATH}")
    else:
        profiles = json.loads(PROFILES_PATH.read_text(encoding="utf-8"))
        if "all" not in profiles.get("profiles", {}):
            errors.append("install-profiles.json missing 'all' profile")
        for pname, profile in (profiles.get("profiles") or {}).items():
            if profile.get("all_skills"):
                continue
            for skill in profile.get("skills") or []:
                if not (SKILLS_ROOT / skill).is_dir():
                    errors.append(f"profile {pname}: missing skill dir {skill}")
            for inc in profile.get("includes") or []:
                if inc not in profiles["profiles"]:
                    errors.append(f"profile {pname}: includes unknown {inc}")

    for skill_dir in sorted(path for path in SKILLS_ROOT.iterdir() if path.is_dir()):
        name = skill_dir.name
        if name in helpers:
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

        yaml_path = skill_dir / "agents" / "openai.yaml"
        if name in first_party:
            if CONTRACT_HEADING not in text:
                errors.append(f"{name}: missing mandatory Contract")
            missing_fields = contract_has_fields(text, contract_fields)
            for field in missing_fields:
                errors.append(f"{name}: Contract table missing {field}")
            if name in preamble_required:
                if PREAMBLE_MARKER not in text:
                    errors.append(f"{name}: must point at {PREAMBLE_MARKER}")
                if "## Language (do this first)" in text:
                    errors.append(
                        f"{name}: inline Language section forbidden; use shared preamble"
                    )
                if "## Memory (read first)" in text:
                    errors.append(
                        f"{name}: inline Memory section forbidden; use shared preamble"
                    )
            if not yaml_path.is_file():
                errors.append(f"{name}: missing agents/openai.yaml")
                continue
            yaml_text = yaml_path.read_text(encoding="utf-8")
            for key in REQUIRED_METADATA_KEYS:
                if key not in yaml_text:
                    errors.append(f"{name}: openai.yaml missing {key[:-1]}")
            if name in report_skills:
                if "executive_summary:" not in yaml_text:
                    errors.append(f"{name}: report schema missing executive_summary")
                if "context_5w1h:" in yaml_text:
                    errors.append(
                        f"{name}: report schema must not include context_5w1h "
                        "(5W1H is a method, not a default section)"
                    )
        else:
            if f"`{name}`" not in third_party_notice:
                errors.append(f"{name}: vendored skill missing third-party attribution")
            # Third-party may ship upstream openai.yaml (e.g. Expo). That is allowed
            # only when listed; still never require first-party Contract.
            if yaml_path.is_file() and name not in third_party_meta_ok:
                errors.append(
                    f"{name}: unexpected agents/openai.yaml on third-party skill "
                    f"(allowlist in first-party-skills.json or remove the file)"
                )
            if CONTRACT_HEADING in text and name not in third_party_meta_ok:
                # Soft: third-party shouldn't look like first-party contracts.
                pass

    init_required = SKILLS_ROOT / "init" / "templates" / "PRJ_REFERENCE.template.md"
    if not init_required.is_file():
        errors.append("init: missing PRJ_REFERENCE.template.md")

    visual_template = (
        SKILLS_ROOT / "brainstorming" / "templates" / "VISUAL_DECISION.template.html"
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
                "VISUAL_DECISION.template.html must support static open "
                "(remove file:// hard block)"
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
        yaml_text = (SKILLS_ROOT / name / "agents" / "openai.yaml").read_text(
            encoding="utf-8"
        )
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
        errors.append(
            "brainstorming DISCUSSION template missing Capability recommendations"
        )
    sq_d = discussion_template.find("## Spec quality review")
    scope_d = discussion_template.find("## Scope in")
    if sq_d < 0 or scope_d < 0 or sq_d > scope_d:
        errors.append(
            "brainstorming DISCUSSION: Spec quality review must appear before Scope in"
        )
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
        if (
            "Spec quality review" not in ba_template_text
            or "Step ledger" not in ba_template_text
        ):
            errors.append(
                "business-analysis template missing Spec quality review / Step ledger"
            )
        sq_pos = ba_template_text.find("## Spec quality review")
        us_pos = ba_template_text.find("## User stories")
        if sq_pos < 0 or us_pos < 0 or sq_pos > us_pos:
            errors.append(
                "business-analysis template: Spec quality review must appear before User stories"
            )

    for skill_name, step_names in step_skills.items():
        for step_name in step_names:
            step_path = SKILLS_ROOT / skill_name / "steps" / step_name
            if not step_path.is_file():
                errors.append(f"{skill_name} missing steps/{step_name}")
                continue
            step_text = step_path.read_text(encoding="utf-8")
            if "Precondition" not in step_text:
                errors.append(f"{skill_name}/{step_name} missing Precondition gate")
            if "Step ledger" not in step_text and skill_name == "business-analysis":
                errors.append(f"{skill_name}/{step_name} missing Step ledger update")
            if step_name != "step-01-init.md" and "Spec quality" not in step_text:
                errors.append(
                    f"{skill_name}/{step_name} missing Spec quality enforcement"
                )

    ba_skill = (SKILLS_ROOT / "business-analysis" / "SKILL.md").read_text(
        encoding="utf-8"
    )
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
    policy_path = ROOT / "docs" / "AGENT_POLICY.md"
    policy = policy_path.read_text(encoding="utf-8") if policy_path.is_file() else ""
    combined = agents + "\n" + policy

    if "SKILL_PREAMBLE.md" not in agents:
        errors.append("docs/AGENTS.md missing SKILL_PREAMBLE reference")
    if "AGENT_POLICY.md" not in agents:
        errors.append("docs/AGENTS.md missing AGENT_POLICY reference")
    if "first-party-skills.json" not in agents:
        errors.append("docs/AGENTS.md missing first-party-skills.json reference")
    if "validate_artifacts.py" not in agents:
        errors.append("docs/AGENTS.md missing validate_artifacts reference")
    agents_lines = len(agents.splitlines())
    if agents_lines > 120:
        errors.append(
            f"docs/AGENTS.md too long ({agents_lines} lines); keep entrypoint thin, detail in AGENT_POLICY.md"
        )
    if not policy_path.is_file():
        errors.append("docs/AGENT_POLICY.md missing")
    else:
        for needle in (
            "## Security",
            "## Workflow",
            "## Artifact format resolution",
            "validate_artifacts.py",
            "Spec quality review",
            "Step ledger",
            "Developer UX / DX",
            "rules.branch.mode",
            "CODE_COMMENTS.md",
            "DESIGN_SYSTEM.md",
            "BUSINESS_ANALYSIS.md",
            "TESTCASES.md",
            ".agents/settings.yaml",
            ".agents/PRJ_REFERENCE.md",
        ):
            if needle not in policy:
                errors.append(f"docs/AGENT_POLICY.md missing {needle}")
    schemas_path = ROOT / "docs" / "artifact-schemas.json"
    tools_schema = ROOT / "tools" / "session" / "artifact-schemas.json"
    if not schemas_path.is_file():
        errors.append("docs/artifact-schemas.json missing")
    elif not (ROOT / "tools" / "session" / "validate_artifacts.py").is_file():
        errors.append("tools/session/validate_artifacts.py missing")
    elif not tools_schema.is_file():
        errors.append("tools/session/artifact-schemas.json missing")
    elif schemas_path.read_text(encoding="utf-8") != tools_schema.read_text(encoding="utf-8"):
        errors.append("docs/artifact-schemas.json and tools/session/artifact-schemas.json must match")
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    for phrase in ("Spec quality", "Step ledger", "business-analysis", "--profile", "core"):
        if phrase not in readme:
            errors.append(f"README.md missing workflow documentation: {phrase}")
    if PROFILES_PATH.is_file():
        profiles_doc = json.loads(PROFILES_PATH.read_text(encoding="utf-8"))
        if profiles_doc.get("default") != "core":
            errors.append("install-profiles.json default must be 'core'")
    settings = (ROOT / "docs" / "settings.yaml").read_text(encoding="utf-8")
    for setting in (
        "require_sequential_step_ledger: true",
        "require_spec_quality_before_downstream_work: true",
        "blocking-capability-gap",
    ):
        if setting not in settings:
            errors.append(f"docs/settings.yaml missing decision policy: {setting}")
    if "session_overview: required" not in settings:
        errors.append("docs/settings.yaml missing session_overview setting")
    if "output_format: markdown" not in settings:
        errors.append("docs/settings.yaml missing default report output_format")
    if "mode: checkout" not in settings and "mode: direct" not in settings:
        errors.append("docs/settings.yaml missing branch.mode policy (checkout|direct)")
    if not (ROOT / "docs" / "CODE_COMMENTS.md").is_file():
        errors.append("docs/CODE_COMMENTS.md missing (code comment convention)")
    if "standard: .agents/CODE_COMMENTS.md" not in settings:
        errors.append("docs/settings.yaml missing code.comments.standard")
    design_system = (ROOT / "docs" / "DESIGN_SYSTEM.md").read_text(encoding="utf-8")
    if "cdn.tailwindcss.com" not in design_system and "ss-card" not in design_system:
        errors.append(
            "docs/DESIGN_SYSTEM.md missing Tailwind CDN / ss-card enterprise theme"
        )
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
    if "DESIGN_SYSTEM.md" not in combined:
        errors.append("AGENTS.md/AGENT_POLICY.md missing DESIGN_SYSTEM reference")
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

    if errors:
        print("SKILL_VALIDATION_FAILED")
        for error in errors:
            print(f"- {error}")
        return 1
    print("SKILL_VALIDATION_OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
