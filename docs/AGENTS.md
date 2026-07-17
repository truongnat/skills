# Agent Rules

This is the entrypoint for AI agents working in this repository. Every agent MUST read and follow these rules strictly.

## Language

All communication, code comments, documentation, and agent output MUST be in **English** unless the user explicitly requests otherwise. Keep it simple, direct, and clear.

## Architecture

- `AGENTS.md`: Entrypoint. Read this first.
- `.agents/DESIGN_SYSTEM.md`: Optional template containing references to the host project's design system.
- `.agents/THIRD_PARTY_SKILLS.md`: Sources, revisions, and licenses for vendored skills.
- `.agents/skills/`: Each directory is an independent skill (or shared helper such as `office-common`).
  - `SKILL.md`: **Authoritative** skill definition when present.
  - First-party workflow and office skills contain a **Contract (mandatory)** section.
  - `agents/openai.yaml`, when present, is machine-readable metadata. It is not a substitute for reading `SKILL.md`.
  - `.agents/skills/office-common/`: shared Python helpers for office skills (not an agent skill).

## Skill compliance

When a skill applies:

1. Read its `SKILL.md` fully **before** other actions for that skill.
2. For first-party workflow/office skills, obey the **Contract (mandatory)** section first.
3. Produce any artifacts required by the skill.
4. Treat safety constraints as hard stops — do not violate them for convenience.
5. If the skill requirements cannot be satisfied, stop and report what is missing.
6. Do **not** rely on `agents/openai.yaml` alone; `SKILL.md` is binding.

## Office skills (supported-lossless)

First-party Python skills: `xlsx`, `docx`, `pptx`, `pdf`.

1. On first use, run `.agents/skills/<skill>/scripts/setup.py`; use that
   skill's private `.venv` runtime and do not install packages globally.
2. Prefer each skill's `scripts/cli.py` over ad-hoc generation.
3. Every create/edit must produce a coverage manifest with `coverage_ratio == 1.0`.
4. Unsupported structures (macros, OLE, signatures, encryption, out-of-subset OOXML/PDF features) **block** publish.
5. Optional tools (LibreOffice, Tesseract, Poppler) may be used when present; if absent, mark checks `skipped` — never false-pass.
6. Keep `.agents/skills/office-common` installed beside the office skills.

## Contract Compliance

Every first-party workflow skill embeds a Contract in `SKILL.md` (mirrored in
`agents/openai.yaml`):

| Field | Description |
|-------|-------------|
| Inputs | What the skill expects as input |
| Outputs | What the skill produces as output |
| Required artifacts | Files that MUST be created or updated, with required fields |
| Safety | Constraints the agent MUST NOT violate |

The agent MUST obey the Contract strictly — it is not advisory. If the contract says "do not modify code", the agent MUST NOT modify code. If it says "create a file", the agent MUST create that file.

## Workflow

Base folder for runtime artifacts: `.agents/sessions/<Task-N-short-description>/` (repo root).

### Dev Lifecycle per Task

1. `brainstorming` → `DISCUSSION.md`
   - Step workflow: seed template → frame → scope/options → recommend → self-check.
   - Templates: `.agents/skills/brainstorming/templates/`; steps: `step-01` … `step-05`.
2. `business-analysis` (optional) → requirement notes
   - Clarify business rules, AC, and process when needed.
3. `basic-design` → `BASIC_DESIGN.md`
   - System-level design: architecture, components, flows, interfaces, data ownership (omit unused sections).
4. `detail-design` → `DETAIL_DESIGN.md`
   - Implementable design: contracts, data model, sequences, rules/operations, optional client mapping (omit unused sections; mark gaps).
5. `planning` → `PLAN.md` + `TASKS.md` (**both required on disk**)
   - Step workflow: seed templates → fill PLAN (slim) → **Work inventory → specific micro-TASKS** → self-check.
   - Templates: `.agents/skills/planning/templates/`; steps: `.agents/skills/planning/steps/step-01` … `step-04`.
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
