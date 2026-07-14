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

## Workflow

Base folder for runtime artifacts: `.agents/sessions/<Task-N-short-description>/`

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
   - Step workflow: seed templates → fill PLAN (slim) → fill TASKS (micro) → self-check.
   - Templates: `skills/planning/templates/`; steps: `skills/planning/steps/step-01` … `step-04`.
   - Reject if: steps skipped, PLAN-only, tasks inside PLAN, or test-matrix as T-001 before code.
6. `sync`
   - Read-only refresh of codebase, git state, and artifacts before execution.
7. `execution` → `EXECUTION.md`
   - Implement changes step by step, record commands and verification.
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
