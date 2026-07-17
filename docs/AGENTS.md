# Agent Rules — iPALET / OpassFab

This is the entrypoint for AI agents working in this repository. Every agent MUST read and follow these rules strictly.

## Language

All communication, code comments, documentation, and agent output MUST be in **English** unless the user explicitly requests otherwise. Keep it simple, direct, and clear.

## Architecture

- `AGENTS.md`: Entrypoint. Read this first.
- `DESIGN_SYSTEM.md`: UI baseline for previews and artifacts.
- `TOOLS.md`: Tool references.
- `skills/`: Each directory is an independent skill.
  - `SKILL.md`: **Authoritative** skill definition. Contains a **Contract (mandatory)** section agents MUST obey.
  - `agents/openai.yaml`: Machine-readable duplicate of the contract for tooling. Not a substitute for reading `SKILL.md`.

## Skill compliance

When a skill applies:

1. Read its `SKILL.md` fully **before** other actions for that skill.
2. Obey the **Contract (mandatory)** section first (Inputs, Outputs, Safety, Required artifacts).
3. Produce required artifacts with required fields.
4. Treat Safety lines as hard stops — do not violate for convenience.
5. If the contract cannot be satisfied, stop and report what is missing.
6. Do **not** rely on opening `agents/openai.yaml` alone — the Contract in `SKILL.md` is binding.

## Contract Compliance

Every skill embeds a Contract in `SKILL.md` (mirrored in `agents/openai.yaml`):

| Field | Description |
|-------|-------------|
| Inputs | What the skill expects as input |
| Outputs | What the skill produces as output |
| Required artifacts | Files that MUST be created or updated, with required fields |
| Safety | Constraints the agent MUST NOT violate |

The agent MUST obey the Contract strictly — it is not advisory. If the contract says "do not modify code", the agent MUST NOT modify code. If it says "create a file", the agent MUST create that file.

## Workspace (code)

Agents MUST use these paths unless the user overrides them in the prompt.

| Role | Path | Access |
|------|------|--------|
| **Feature work root** | `OPASS/branches/features/VIETIS/` | Default **read/write** for implement / planning file discover / sync |
| Active module checkout | `OPASS/branches/features/VIETIS/<module>_main/` (e.g. `cost_main`, `master_main`, `report_main`, `stock_main`) | Read/write for the module under work |
| Baseline / reference | `OPASS/branches/develop/` | **Read-only** reference unless user explicitly asks to change develop |
| Session artifacts | `.agents/sessions/<Task-N-short-description>/` | Read/write for DISCUSSION / PLAN / TASKS / … |

### Rules

1. **Implement and edit production code only under** `OPASS/branches/features/VIETIS/` (pick the correct `<module>_main` for the feature).
2. Prefer paths relative to repo root, e.g. `OPASS/branches/features/VIETIS/cost_main/backend/...`.
3. Do **not** treat `tmp/`, unrelated legacy trees, or random checkouts as the primary work tree.
4. Use `OPASS/branches/develop/` to **compare / copy patterns**, not as the default save target.
5. If the feature module is unclear (`cost_main` vs `report_main` …), ask the user once, then record it in PLAN/TASKS Affected areas.
6. Sync / execution / review MUST scope dirty-file and drift checks to the active VIETIS module path (+ session artifacts).

Cross-check project layout notes in `.vconf/project-info.md` and `.vconf/project-rules.json` (`featureRoot`) when present.

## Workflow

Base folder for runtime artifacts: `.agents/sessions/<Task-N-short-description>/` (repo root).  
Base folder for **code** changes: `OPASS/branches/features/VIETIS/` (see Workspace above).

### Dev Lifecycle per Task

1. `brainstorming` → `DISCUSSION.md`
   - Step workflow: seed template → frame → scope/options → recommend → self-check.
   - Templates: `skills/brainstorming/templates/`; steps: `step-01` … `step-05`.
2. `business-analysis` (optional) → requirement notes
   - Clarify business rules, AC, and process when needed.
3. `basic-design` → `BASIC_DESIGN.md`
   - System-level design: architecture, components, flows, interfaces, data ownership (omit unused sections).
4. `detail-design` → `DETAIL_DESIGN.md`
   - Implementable design: contracts, data model, sequences, rules/operations, optional client mapping (omit unused sections; mark gaps).
5. `planning` → `PLAN.md` + `TASKS.md` (**both required on disk**)
   - Step workflow: seed templates → fill PLAN (slim) → **Work inventory → specific micro-TASKS** → self-check.
   - Templates: `skills/planning/templates/`; steps: `skills/planning/steps/step-01` … `step-04`.
   - Reject if: steps skipped, PLAN-only, empty TASKS template, tasks inside PLAN, test-matrix as T-001 before code, missing inventory, vague/epic cards (layer-only titles, no Work items, multi-endpoint/screen), or **Ready=Yes with open blockers**.
6. `sync`
   - Read-only refresh of codebase, git state, and artifacts before execution.
   - Respect PLAN Ready/blockers; rewrite `SYNC.md` if older than PLAN/TASKS.
7. `execution` → `EXECUTION.md` (+ live progress in `TASKS.md`)
   - Implement changes step by step, record commands and verification.
   - As each Work item / card finishes: check off `- [ ]` → `- [x]`, set Status (`in_progress` / `done` / `blocked`), update Progress board Done column.
8. `review` → `REVIEW.md`
   - Check correctness, regression, security, maintainability.
9. `done` → `DONE.md`, `PR_MESSAGE.md`, `PR_DESCRIPTION.md`
   - Summarize, handoff, prepare PR/MR.

Lite skip: small/clear tasks may skip business-analysis, basic-design, and detail-design when brainstorming hands off straight to planning or execution.

### Investigation

`investigate` → `INVESTIGATE.md`

Use when debugging or tracing root cause — no commitment to implement.

### PR Review

`review-pr` → `REVIEW_PR.md`

Use when reviewing a pull request or branch diff.

### Research

`research` → `RESEARCH.md`

Use when researching external sources or making technical decisions.

## Artifact Quality

- Output must be **short, structured, decision-oriented**.
- Use bullet lists and tables over paragraphs.
- No filler sections. No marketing language.
- Keep it in **simple English**.
