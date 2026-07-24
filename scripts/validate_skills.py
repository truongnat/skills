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
        if "## Work layout (mandatory)" not in preamble_text:
            errors.append("SKILL_PREAMBLE.md missing Work layout section")
        if ".agent-work/" not in preamble_text:
            errors.append("SKILL_PREAMBLE.md must reference .agent-work/")
        if "session.sh" not in preamble_text:
            errors.append("SKILL_PREAMBLE.md must reference session.sh")
    if not (ROOT / "docs" / "gitignore.agent-work.snippet").is_file():
        errors.append("docs/gitignore.agent-work.snippet missing")
    gitignore = (ROOT / ".gitignore").read_text(encoding="utf-8")
    if ".agent-work/" not in gitignore:
        errors.append("repo .gitignore must ignore .agent-work/")
    if "gitignore.agent-work" not in (ROOT / "install.sh").read_text(encoding="utf-8"):
        errors.append("install.sh must ensure host .gitignore includes .agent-work/")
    if "agent-work" not in (ROOT / "install.ps1").read_text(encoding="utf-8"):
        errors.append("install.ps1 must ensure host .gitignore includes .agent-work/")

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
                if "Work layout" not in text and ".agent-work/" not in text:
                    errors.append(
                        f"{name}: shared preamble must mention Work layout / .agent-work/"
                    )
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
    if "## Keywords" not in discussion_template:
        errors.append("brainstorming DISCUSSION template missing Keywords")
    kw_d = discussion_template.find("## Keywords")
    goal_d = discussion_template.find("## Goal")
    if kw_d < 0 or goal_d < 0 or kw_d > goal_d:
        errors.append("brainstorming DISCUSSION: Keywords must appear before Goal")
    if "Step ledger" not in discussion_template:
        errors.append("brainstorming DISCUSSION template missing Step ledger")
    if "Feasibility" not in discussion_template or "Correctness" not in discussion_template:
        errors.append("brainstorming DISCUSSION template missing Feasibility/Correctness")
    if (
        "Capability recommendations" not in discussion_template
        and "Capability gaps" not in discussion_template
    ):
        errors.append(
            "brainstorming DISCUSSION template missing Capability gaps/recommendations"
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

    for skill_name, template_rel, before_heading in (
        (
            "basic-design",
            "templates/BASIC_DESIGN.template.md",
            "## Goal",
        ),
        (
            "detail-design",
            "templates/DETAIL_DESIGN.template.md",
            "## Goal",
        ),
        (
            "investigate",
            "templates/INVESTIGATE.template.md",
            "## Evidence",
        ),
    ):
        tmpl_path = SKILLS_ROOT / skill_name / template_rel
        if not tmpl_path.is_file():
            errors.append(f"{skill_name} missing {template_rel}")
            continue
        tmpl = tmpl_path.read_text(encoding="utf-8")
        if "Doc reality check" not in tmpl:
            errors.append(f"{skill_name} template missing Doc reality check")
        if skill_name in {"investigate"} and "## Keywords" not in tmpl:
            errors.append(f"{skill_name} template missing Keywords")
        dr = tmpl.find("## Doc reality check")
        after = tmpl.find(before_heading)
        if dr < 0 or after < 0 or dr > after:
            errors.append(
                f"{skill_name} template: Doc reality check must appear before {before_heading}"
            )
        skill_text = (SKILLS_ROOT / skill_name / "SKILL.md").read_text(encoding="utf-8")
        if "doc_reality_check" not in skill_text:
            errors.append(f"{skill_name} SKILL.md missing doc_reality_check contract")
        low = skill_text.lower()
        if not any(
            needle in low
            for needle in ("stop and ask", "stop immediately", "confirm-first")
        ):
            errors.append(
                f"{skill_name} SKILL.md must require Confirm-first / stop on blockers"
            )
        if skill_name in {"investigate", "basic-design", "detail-design"}:
            if "ask method" not in low:
                errors.append(f"{skill_name} SKILL.md missing Ask method classification")

    research_tmpl = SKILLS_ROOT / "research" / "templates" / "RESEARCH.template.md"
    if not research_tmpl.is_file():
        errors.append("research missing templates/RESEARCH.template.md")
    else:
        rt = research_tmpl.read_text(encoding="utf-8")
        if "## Keywords" not in rt:
            errors.append("research RESEARCH template missing Keywords")
        if "keywords" not in (SKILLS_ROOT / "research" / "SKILL.md").read_text(
            encoding="utf-8"
        ):
            errors.append("research SKILL.md missing keywords contract")

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
        if overview_template.is_file():
            errors.append(
                f"OVERVIEW.template.md is retired (stale landing page): {overview_template}"
            )
    if '"OVERVIEW"' in (ROOT / "docs" / "artifact-schemas.json").read_text(
        encoding="utf-8"
    ):
        errors.append("docs/artifact-schemas.json must not require OVERVIEW artifact")
    exec_skill = (ROOT / "skills" / "execution" / "SKILL.md").read_text(
        encoding="utf-8"
    )
    if "#### `OVERVIEW.md`" in exec_skill or "Refresh OVERVIEW.md" in exec_skill:
        errors.append(
            "execution must not require OVERVIEW.md; use session.sh status + TASKS.md"
        )
    brainstorm_init = (
        SKILLS_ROOT / "brainstorming" / "steps" / "step-01-init.md"
    ).read_text(encoding="utf-8")
    if "OVERVIEW.md" in brainstorm_init and "No `OVERVIEW.md`" not in brainstorm_init:
        errors.append("brainstorming step-01 must not seed OVERVIEW.md")
    planning_init = (SKILLS_ROOT / "planning" / "steps" / "step-01-init.md").read_text(
        encoding="utf-8"
    )
    if "OVERVIEW.template.md" in planning_init:
        errors.append("planning step-01 must not seed OVERVIEW.template.md")

    tasks_template = (
        SKILLS_ROOT / "planning" / "templates" / "TASKS.template.md"
    ).read_text(encoding="utf-8")
    if "#### Dev context" not in tasks_template:
        errors.append("TASKS.template.md missing #### Dev context section")
    if "[Source:" not in tasks_template:
        errors.append("TASKS.template.md must require [Source:] cites in Dev context")
    if "No specific guidance found" not in tasks_template:
        errors.append("TASKS.template.md must allow 'No specific guidance found.'")
    if "Dev context" not in (
        SKILLS_ROOT / "planning" / "steps" / "step-03-fill-tasks.md"
    ).read_text(encoding="utf-8"):
        errors.append("planning step-03 must require Dev context on cards")
    policy_text = (ROOT / "docs" / "AGENT_POLICY.md").read_text(encoding="utf-8")
    if "Scale & Quick path" not in policy_text:
        errors.append("AGENT_POLICY.md missing Scale & Quick path")
    if "Implementation readiness" not in (
        SKILLS_ROOT / "sync" / "SKILL.md"
    ).read_text(encoding="utf-8"):
        errors.append("sync SKILL.md missing Implementation readiness gate")
    for needle in ("PASS", "CONCERNS", "FAIL"):
        if needle not in (SKILLS_ROOT / "sync" / "SKILL.md").read_text(encoding="utf-8"):
            errors.append(f"sync SKILL.md missing readiness verdict {needle}")
    sync_schema = json.loads(
        (ROOT / "docs" / "artifact-schemas.json").read_text(encoding="utf-8")
    )
    sync_heads = sync_schema.get("artifacts", {}).get("SYNC", {}).get(
        "required_headings", []
    )
    if "Implementation readiness" not in sync_heads:
        errors.append("artifact-schemas SYNC must require Implementation readiness")
    brainstorm = (SKILLS_ROOT / "brainstorming" / "SKILL.md").read_text(encoding="utf-8")
    if "Diverge then converge" not in brainstorm and "diverge then converge" not in brainstorm:
        errors.append("brainstorming SKILL.md missing diverge/converge guidance")
    if "one focused question" not in brainstorm.casefold():
        errors.append("brainstorming SKILL.md missing one-question facilitation rule")
    if "Load Dev context first" not in (
        SKILLS_ROOT / "execution" / "SKILL.md"
    ).read_text(encoding="utf-8"):
        errors.append("execution must load Dev context before implementing a card")
    if "## Scale (Quick / Lite / Full)" not in (
        ROOT / "docs" / "SKILL_PREAMBLE.md"
    ).read_text(encoding="utf-8"):
        errors.append("SKILL_PREAMBLE.md missing Scale (Quick / Lite / Full)")

    if not (ROOT / "docs" / "START_HERE.md").is_file():
        errors.append("docs/START_HERE.md missing")
    if not (ROOT / "docs" / "WHAT_NEXT.md").is_file():
        errors.append("docs/WHAT_NEXT.md missing")
    if not (ROOT / "docs" / "MIGRATION.md").is_file():
        errors.append("docs/MIGRATION.md missing")
    if not (ROOT / "docs" / "examples" / "README.md").is_file():
        errors.append("docs/examples/README.md missing")
    for tool in ("lint_artifacts.py", "build_context.py"):
        if not (ROOT / "tools" / "session" / tool).is_file():
            errors.append(f"tools/session/{tool} missing")
    if "quick-fix" not in json.dumps(
        json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    ):
        errors.append("first-party-skills.json missing quick-fix")
    if "START_HERE.md" not in (ROOT / "docs" / "AGENTS.md").read_text(encoding="utf-8"):
        errors.append("docs/AGENTS.md must point at START_HERE.md")
    if "Domain terms" not in (ROOT / "docs" / "SKILL_PREAMBLE.md").read_text(
        encoding="utf-8"
    ):
        errors.append("SKILL_PREAMBLE.md missing Domain terms language rule")
    preamble_lang = (ROOT / "docs" / "SKILL_PREAMBLE.md").read_text(encoding="utf-8")
    if "What stays English" not in preamble_lang:
        errors.append("SKILL_PREAMBLE.md missing What stays English (headings) rule")
    if "One language per artifact" not in preamble_lang:
        errors.append("SKILL_PREAMBLE.md missing One language per artifact rule")
    if "Tóm tắt" not in preamble_lang:
        errors.append("SKILL_PREAMBLE.md should show Wrong VI heading example")
    if "## Keywords" not in preamble_lang and "### Keywords" not in preamble_lang:
        errors.append("SKILL_PREAMBLE.md missing Keywords glossary criteria")
    if "Where seen" not in preamble_lang:
        errors.append("SKILL_PREAMBLE Keywords must define Where seen column")
    if "Confirm-first" not in preamble_lang:
        errors.append("SKILL_PREAMBLE.md missing Confirm-first (ask before finish) rule")
    if "Complete-with-questions" not in preamble_lang:
        errors.append("SKILL_PREAMBLE.md missing Complete-with-questions ban")
    if "Ask method" not in preamble_lang:
        errors.append("SKILL_PREAMBLE.md missing Ask method classification")
    for method in ("confirm", "choice", "fact", "table", "diagram", "html"):
        # table row uses backticks around method names
        if f"`{method}`" not in preamble_lang:
            errors.append(f"SKILL_PREAMBLE Ask methods missing `{method}`")
    if "STOP immediately" not in preamble_lang:
        errors.append("SKILL_PREAMBLE Confirm-first must require STOP immediately")
    if "Who commits what" not in (ROOT / "docs" / "AGENT_WORK.md").read_text(
        encoding="utf-8"
    ):
        errors.append("AGENT_WORK.md missing ownership / Who commits what")
    work_doc_early = (ROOT / "docs" / "AGENT_WORK.md").read_text(encoding="utf-8")
    if "Work commit protocol" not in work_doc_early:
        errors.append("AGENT_WORK.md missing Work commit protocol")
    if "session.sh archive" not in work_doc_early:
        errors.append("AGENT_WORK.md must document session.sh archive")
    session_sh = (ROOT / "tools" / "session" / "session.sh").read_text(encoding="utf-8")
    if "cmd_doctor" not in session_sh:
        errors.append("session.sh missing doctor command")
    if "cmd_commit" not in session_sh:
        errors.append("session.sh missing commit command")
    if "cmd_archive" not in session_sh:
        errors.append("session.sh missing archive command")
    if "Work commit protocol" not in preamble_lang:
        errors.append("SKILL_PREAMBLE.md missing Work commit protocol")
    for life in (
        "brainstorming",
        "investigate",
        "research",
        "business-analysis",
        "basic-design",
        "detail-design",
        "planning",
        "sync",
        "execution",
        "review",
        "quick-fix",
        "done",
    ):
        skill_text = (SKILLS_ROOT / life / "SKILL.md").read_text(encoding="utf-8")
        if "session.sh commit" not in skill_text:
            errors.append(f"{life} SKILL.md missing session.sh commit checklist")
    if "session.sh archive" not in (SKILLS_ROOT / "done" / "SKILL.md").read_text(
        encoding="utf-8"
    ):
        errors.append("done SKILL.md missing session.sh archive")
    install_sh = (ROOT / "install.sh").read_text(encoding="utf-8")
    if "START_HERE.md" not in install_sh:
        errors.append("install.sh must copy START_HERE.md")
    if "cmd_uninstall" not in install_sh or "cmd_doctor" not in install_sh:
        errors.append("install.sh must expose uninstall and doctor commands")
    i_entry = ROOT / "i"
    if not i_entry.is_file():
        errors.append("short installer entrypoint 'i' missing")
    else:
        i_text = i_entry.read_text(encoding="utf-8")
        if "install.sh" not in i_text:
            errors.append("short entrypoint 'i' must delegate to install.sh")
    install_ps1 = (ROOT / "install.ps1").read_text(encoding="utf-8")
    if "Invoke-Uninstall" not in install_ps1 or "Invoke-Doctor" not in install_ps1:
        errors.append("install.ps1 must expose uninstall and doctor commands")
    pyproject = (ROOT / "pyproject.toml").read_text(encoding="utf-8")
    if 'sk = "simple_skills.cli:main"' not in pyproject:
        errors.append("pyproject.toml must expose console script sk")
    if not (ROOT / "src" / "simple_skills" / "cli.py").is_file():
        errors.append("src/simple_skills/cli.py missing")

    agents = (ROOT / "docs" / "AGENTS.md").read_text(encoding="utf-8")
    policy_path = ROOT / "docs" / "AGENT_POLICY.md"
    policy = policy_path.read_text(encoding="utf-8") if policy_path.is_file() else ""
    combined = agents + "\n" + policy

    if "Work commit protocol" not in policy and "session.sh commit" not in policy:
        errors.append("AGENT_POLICY.md missing Work commit protocol / session.sh commit")
    if "Confirm-first" not in policy:
        errors.append("AGENT_POLICY.md missing Confirm-first decision gate")
    if "Ask method" not in policy and "require_ask_method_classification" not in policy:
        errors.append("AGENT_POLICY.md missing Ask method classification")
    if "stop_immediately_on_blocking_question" not in policy:
        errors.append("AGENT_POLICY.md missing stop_immediately_on_blocking_question")
    if "AGENT_POLICY.md" not in agents:
        errors.append("docs/AGENTS.md missing AGENT_POLICY reference")
    if "AGENT_WORK.md" not in agents and "agent-work" not in agents:
        errors.append("docs/AGENTS.md missing AGENT_WORK / .agent-work reference")
    if not (ROOT / "docs" / "AGENT_WORK.md").is_file():
        errors.append("docs/AGENT_WORK.md missing")
    else:
        work_doc = (ROOT / "docs" / "AGENT_WORK.md").read_text(encoding="utf-8")
        for needle in (".agent-work/", "sessions/", "memory/", "Kit", "Work"):
            if needle not in work_doc:
                errors.append(f"docs/AGENT_WORK.md missing {needle}")
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
            ".agent-work/sessions",
            ".agent-work/memory",
            "AGENT_WORK.md",
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
    for needle in (
        "language:",
        "mode: checkout",
        "output_format: markdown",
        "docs:",
        "AGENT_POLICY.md",
    ):
        if needle not in settings:
            errors.append(f"docs/settings.yaml missing lean knob / pointer: {needle}")
    # Bloated knobs must stay out of the default settings template.
    for bloat in (
        "stop_on:",
        "require_sequential_step_ledger:",
        "session_overview:",
        "executive_summary_max_items:",
        "doc_comments:",
        "flow_comments:",
        "triage:",
    ):
        if bloat in settings:
            errors.append(
                f"docs/settings.yaml must stay lean; move '{bloat}' to AGENT_POLICY defaults"
            )
    policy = (ROOT / "docs" / "AGENT_POLICY.md").read_text(encoding="utf-8")
    for setting in (
        "require_sequential_step_ledger: true",
        "require_spec_quality_before_downstream_work: true",
        "blocking-capability-gap",
        "Thinking methods (session-wide)",
        "Built-in defaults",
        "Vital few",
        "5W1H",
    ):
        if setting not in policy:
            errors.append(f"docs/AGENT_POLICY.md missing built-in default: {setting}")
    if re.search(r"(?m)^##\s+Executive summary \(80/20\)", policy):
        errors.append("AGENT_POLICY must not use branded Executive summary heading")
    if "starts with **Executive summary (80/20)**" in policy:
        errors.append("AGENT_POLICY must not require branded Executive summary title")
    preamble = (ROOT / "docs" / "SKILL_PREAMBLE.md").read_text(encoding="utf-8")
    if "## Thinking methods (session-wide" not in preamble:
        errors.append("SKILL_PREAMBLE.md missing Thinking methods section")
    if "## Readable writing (mandatory" not in preamble:
        errors.append("SKILL_PREAMBLE.md missing Readable writing section")
    for needle in (
        "first pass",
        "Do not:",
        "_(TODO)_",
        "concrete",
    ):
        if needle.casefold() not in preamble.casefold():
            errors.append(f"SKILL_PREAMBLE Readable writing missing: {needle}")
    if "Readable first" not in policy:
        errors.append("AGENT_POLICY.md missing Readable first artifact quality bar")
    for template in (
        SKILLS_ROOT / "brainstorming" / "templates" / "DISCUSSION.template.md",
        SKILLS_ROOT / "business-analysis" / "templates" / "BUSINESS_ANALYSIS.template.md",
        SKILLS_ROOT / "planning" / "templates" / "PLAN.template.md",
    ):
        text = template.read_text(encoding="utf-8")
        if "Readable writing" not in text:
            errors.append(f"{template.relative_to(ROOT)} must point at Readable writing")
        if "Finding (concrete)" not in text:
            errors.append(
                f"{template.relative_to(ROOT)} Spec quality must require concrete findings"
            )
        if "flowchart TD\n  Goal[Goal]" in text or "Problem[Problem] --> Quality" in text:
            errors.append(f"{template.relative_to(ROOT)} must not seed decorative Mermaid")
    # Templates must not brand method names into headings.
    for path in (ROOT / "skills").rglob("*.template.md"):
        text = path.read_text(encoding="utf-8")
        for bad in ("(80/20)", "## 5W1H", "## 5w1h", "Executive summary (80"):
            if bad in text:
                errors.append(f"{path.relative_to(ROOT)}: remove method branding '{bad}'")
    if not (ROOT / "docs" / "CODE_COMMENTS.md").is_file():
        errors.append("docs/CODE_COMMENTS.md missing (code comment convention)")
    if "CODE_COMMENTS.md" not in policy:
        errors.append("docs/AGENT_POLICY.md must reference CODE_COMMENTS.md")
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
