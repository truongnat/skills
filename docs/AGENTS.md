# Agent Rules

This is the entrypoint for AI agents working in this repository. Every agent MUST read and follow these rules strictly.

## Settings

Read `.agents/settings.yaml` and `.agents/PRJ_REFERENCE.md` at the **start of
every task**. Settings configure agent behavior; the project reference contains
the current project facts, architecture, business rules, constraints, commands,
and conventions.

- `language`: `en` (default) or `vi`. Controls the language of agent
  communication **and** the prose written into saved artifacts.
  - `en`: reply and write artifacts in English.
  - `vi`: reply and write artifacts in Vietnamese — Markdown prose,
    explanations, summaries, findings, and commit/PR messages.
- Keep code, identifiers, file paths, CLI commands, and template section keys
  unchanged regardless of `language`.
- If `.agents/settings.yaml` is missing or the value is unknown, default to
  `en`. A direct instruction in the current user request overrides the file.
- Project-specific branch, commit, PR, report, and code-comment rules live
  under `rules` in settings. Apply only populated values.
- If `.agents/PRJ_REFERENCE.md` is missing or materially stale, run the `init`
  skill before other lifecycle skills. Use `force` mode only when explicitly
  requested.

## Architecture

- `AGENTS.md`: Entrypoint. Read this first.
- `.agents/settings.yaml`: Project-level agent settings (language, etc.). Read first.
- `.agents/PRJ_REFERENCE.md`: Generated project context shared by all skills.
- `.agents/DESIGN_SYSTEM.md`: Optional template containing references to the host project's design system.
- `.agents/THIRD_PARTY_SKILLS.md`: Sources, revisions, and licenses for vendored skills.
- `.agents/skills/`: Each directory is an independent skill (or shared helper such as `office-common`).
  - `SKILL.md`: **Authoritative** skill definition when present.
  - First-party workflow and office skills contain a **Contract (mandatory)** section.
  - `agents/openai.yaml`, when present, is machine-readable metadata. It is not a substitute for reading `SKILL.md`.
  - `.agents/skills/office-common/`: shared Python helpers for office skills (not an agent skill).

### Skill architecture

- Every invokable skill has one authoritative `SKILL.md`.
- First-party skills must also have `agents/openai.yaml` mirroring inputs,
  outputs, safety, workflow, and artifact schema.
- Vendored third-party skills retain their upstream structure and are listed in
  `.agents/THIRD_PARTY_SKILLS.md`; do not fabricate first-party contracts for
  them.
- Shared helpers are not invokable skills and must be documented as such.
- Repository validation: `python scripts/validate_skills.py`.

## Skill compliance

When a skill applies:

1. Read its `SKILL.md` fully **before** other actions for that skill.
2. For first-party workflow/office skills, obey the **Contract (mandatory)** section first.
3. Produce any artifacts required by the skill.
4. Treat safety constraints as hard stops — do not violate them for convenience.
5. If the skill requirements cannot be satisfied, stop and report what is missing.
6. Do **not** rely on `agents/openai.yaml` alone; `SKILL.md` is binding.

## Security (hard rules)

These rules are hard stops. They cannot be disabled by settings and override
convenience.

1. **Secrets**: Never read, print, log, echo, or commit secrets or credentials
   (`.env`, tokens, API keys, passwords, private keys). Redact when quoting.
   Do not commit files likely to hold secrets (`.env`, `credentials.json`,
   `*.pem`, `id_rsa`); warn the user if explicitly asked to.
2. **Least exposure**: Do not send project code or data to external services
   without explicit user consent.
3. **Destructive actions**: Do not run irreversible commands (e.g.
   `git push --force` to shared branches, `git reset --hard`, `rm -rf`,
   `DROP`/`TRUNCATE`) without explicit confirmation.
4. **No weakening controls**: Do not disable or bypass auth, permission checks,
   input validation, or TLS/cert verification to make something work.
5. **Untrusted input**: Do not introduce injection risks (SQL, command, path
   traversal). Validate and escape external input.
6. **Dependencies**: Add only dependencies from trusted sources with an
   explicit reviewed version/range; update the lockfile when the project uses
   one. Do not add unknown or unconstrained packages silently.
7. **Report, don't hide**: If a security risk is found or a rule blocks the
   task, stop and report it clearly instead of working around it.

## Office skills (supported-lossless)

First-party Python skills: `xlsx`, `docx`, `pptx`, `pdf`.

1. On first use, run `.agents/skills/<skill>/scripts/setup.py`; use that
   skill's private `.venv` runtime and do not install packages globally.
2. Prefer each skill's `scripts/cli.py` over ad-hoc generation.
3. Every create/edit must produce a coverage manifest with `coverage_ratio == 1.0`.
4. Unsupported structures (macros, OLE, signatures, encryption, out-of-subset OOXML/PDF features) **block** publish.
5. Optional tools (LibreOffice, Tesseract, Poppler) may be used when present; if absent, mark checks `skipped` — never false-pass.
6. Keep `.agents/skills/office-common` installed beside the office skills.

## Source-code comments

During execution/coding:

- Add short comments for non-obvious control flow, business-rule application,
  invariants, compatibility workarounds, security boundaries, and important
  trade-offs. Explain **why**, not a line-by-line **what**.
- For multi-stage flows, place a brief flow/rationale comment at the
  orchestration boundary so a reviewer can understand sequencing and failure
  behavior.
- Follow comment/docstring conventions from `.agents/PRJ_REFERENCE.md` and
  `.agents/settings.yaml`; update comments when behavior changes.
- Avoid comments that merely repeat clear code. If no comment is needed, keep
  the code self-explanatory through naming and structure.

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

### Project initialization

Run `init` first when entering a project or when `.agents/PRJ_REFERENCE.md` is
missing. Re-run it in `refresh` mode after material architecture, tooling, or
business-rule changes. Explicit `force` mode rebuilds the reference from the
current repository while preserving user settings.

### Dev Lifecycle per Task

1. `brainstorming` → `DISCUSSION.md`
   - Step workflow: seed template → frame → scope/options → recommend → self-check.
   - Templates: `.agents/skills/brainstorming/templates/`; steps: `step-01` … `step-05`.
2. `business-analysis` (optional) → `BUSINESS_ANALYSIS.md`
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
9. `done` → `DONE.md` (+ optional `PR_MESSAGE.md`, `PR_DESCRIPTION.md`)
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

### Testing

`tester` → `TESTCASES.md` (+ optional `TESTCASES.csv`)

Use when requirements, plans, or implemented changes need test design,
traceability, test data, or verification evidence.

## Artifact Quality

- Every human-readable report starts with **Executive summary (80/20)**:
  at most five bullets containing the decision, outcome, top findings/risks,
  and next action. Readers should understand the important 20% first.
- Add a **5W1H context** block (What, Why, Who, When, Where, How) when it
  materially clarifies scope or ownership. Use `N/A`/`Unknown` instead of
  padding or inventing details.
- Put supporting evidence and implementation detail after the summary. Detail
  remains mandatory where contracts, safety, verification, or reproducibility
  require it.
- Apply project-specific report sections from `.agents/settings.yaml`.
- Output must be **short, structured, decision-oriented**.
- Use bullet lists and tables over paragraphs.
- No filler sections. No marketing language.
- Keep it clear and simple, in the language set by `.agents/settings.yaml`.
