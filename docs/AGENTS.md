# Agent Rules — iPALET / OpassFab

This is the entrypoint for AI agents working in this repository. Every agent MUST read and follow these rules strictly.

## Language

All communication, code comments, documentation, and agent output MUST be in **English** unless the user explicitly requests otherwise. Keep it simple, direct, and clear.

## Architecture

- `AGENTS.md`: Entrypoint. Read this first.
- `DESIGN_SYSTEM.md`: UI baseline for previews and artifacts.
- `TOOLS.md`: Tool references.
- `skills/`: Each directory is an independent skill.
  - `SKILL.md`: Skill definition with `name`, `description`, workflow, quality standards, and examples.
  - `agents/openai.yaml`: Contract fields (`required_input`, `required_output`, `artifacts`, `note_important`).

## Contract Compliance

Every skill's `agents/openai.yaml` defines a `<Contract>` with fields that require strict agent adherence:

| Field | Source | Description |
|-------|--------|-------------|
| `required_input` | `<Inputs>` | What the skill expects as input |
| `required_output` | `<Outputs>` | What the skill produces as output |
| `artifacts` | `<Artifacts>` | What files are created or updated |
| `note_important` | `<Safety>` | Constraints the agent MUST NOT violate |

The agent MUST obey the contract fields strictly — they are not advisory. If the contract says "do not modify code", the agent MUST NOT modify code. If it says "create a file", the agent MUST create that file.

## Workflow

Base folder for runtime artifacts: `.agents/sessions/<Task-N-short-description>/`

### Dev Lifecycle per Task

1. `brainstorming` → `DISCUSSION.md`
   - Clarify goals, scope, trade-offs, and direction.
2. `business-analysis` (optional) → requirement notes
   - Clarify business rules, AC, and process when needed.
3. `basic-design` → `BASIC_DESIGN.md`
   - System-level design: architecture, components, flows, interfaces, data ownership (omit unused sections).
4. `detail-design` → `DETAIL_DESIGN.md`
   - Implementable design: contracts, data model, sequences, rules/operations, optional client mapping (omit unused sections; mark gaps).
5. `planning` → `PLAN.md` + `TASKS.md`
   - PLAN: strategy, DoD, rollback, task index. TASKS: detailed task cards, AC, verification, order.
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
