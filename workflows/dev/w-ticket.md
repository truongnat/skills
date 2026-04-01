# Workflow: ticket

End-to-end **ticket / Kanban** execution using the **`ex/ticket`** convention (local `kanban/<ticket>/`, `meta.json`, phased artifacts), **bundled `skills/*-pro`** for domain work, and **gap closure** when a domain skill is missing. Aligns with [`ex/ticket/SKILL.md`](../../ex/ticket/SKILL.md) (ticket phases and file layout).

**Domain:** `dev` — this file lives under **`workflows/dev/`**. **Filename** follows **`w-<slug>.md`** (see [`workflows/README.md`](../README.md#naming)).

**Invoke:** `/w-ticket` (see [`.claude/commands/w-ticket.md`](../../.claude/commands/w-ticket.md)).

## Metadata

| Field | Value |
|-------|-------|
| **id** | `ticket` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `ticket` | Yes | Ticket id (e.g. `PROJ-123`, `42`) — matches `kanban/<ticket>/` |
| `domain_stack` | No | Hint for which `*-pro` skills apply (e.g. NestJS + Postgres + testing) |
| `issue_spec` | No | Path or summary of `issue.md` / Jira body — feeds plan and acceptance criteria |

## Outputs

| Variable | Description |
|----------|-------------|
| `kanban_tree` | Paths under `kanban/<ticket>/` with `meta.json` and versioned artifacts |
| `implementation` | Code + tests per ticket:work |
| `closing_reports` | `report_ticket.md`, summary, etc. per ticket:done |
| `bundle_state` | `validate_skills` result if any new `skills/<name>/` was added |

## Steps

### Step 1 — `skill-inventory`

- **Type:** skill
- **Skill:** `planning-pro` (+ `business-analysis-pro` if requirements are vague)
- **Input:** `issue_spec`, `domain_stack` — list which **bundled** skills (`skills/*-pro`) are needed for this ticket.
- **Output:** named skill list — [references/scope-and-decomposition.md](../../skills/planning-pro/references/scope-and-decomposition.md)

### Step 2 — `create-missing-skill` (conditional)

- **When:** A required capability has **no** suitable bundled skill and cannot be merged into an existing `*-pro` skill (see [`skills/SKILL_AUTHORING_RULES.md`](../../skills/SKILL_AUTHORING_RULES.md) §1).
- **Type:** skill
- **Skill:** `skills-self-review-pro` + **`repo-tooling-pro`**
- **Actions:**
  1. Confirm **§1** in `SKILL_AUTHORING_RULES.md` — topic is distinct and not duplicate.
  2. Copy [`skills/examples/skill-template/`](../../skills/examples/skill-template/) → `skills/<new-name>/` and complete `SKILL.md` per **§2–§7**.
  3. Run **`python scripts/validate_skills.py`** from repo root; fix until pass.
  4. Apply **§8** in the **same change**: `skills/README.md`, root **`README.md`**, **`AGENTS.md`**, **§1** list in `SKILL_AUTHORING_RULES.md`, **`knowledge-base/documents/repo/skills-layout.md`**.
  5. Run **`python scripts/build_skill_index.py`** so routing/embeddings see the new skill.
- **Output:** `bundle_state` — new skill folder is valid and documented.

### Step 3 — `ticket-bootstrap`

- **Type:** skill
- **Skill:** **`ex/ticket`** (ticket conventions — read as primary contract)
- **Input:** `ticket`
- **Output:** `kanban_tree` — read or create [`meta.json`](../../ex/ticket/references/meta-schema.md), resolve `current_version` / phase, follow `ticket:start` / `ticket:status` semantics in [`ex/ticket/SKILL.md`](../../ex/ticket/SKILL.md).

### Step 4 — `plan-and-todo`

- **Type:** skill
- **Skill:** `planning-pro` (+ `business-analysis-pro` for acceptance criteria from `issue_spec`)
- **Input:** `kanban_tree` + issue content — align `plan.md`, `todo.md`, `checklist.md`, `estimated.md` under the active version folder per `ex/ticket`.
- **Output:** plan artifacts ready for `ticket:work` guards.

### Step 5 — `implement-and-test`

- **Type:** skill
- **Skill:** domain **`*-pro`** skills from Step 1 + **`testing-pro`**
- **Input:** `plan-and-todo` outputs; implement per stack; record progress in `report_work.md` / `gaps.md` as required by `ex/ticket`.
- **Output:** `implementation` — tests and coverage expectations per `testing-pro` ([test-pyramid-and-strategy.md](../../skills/testing-pro/references/test-pyramid-and-strategy.md)).

### Step 6 — `ticket-done-and-git`

- **Type:** skill
- **Skill:** `ex/ticket` (ticket:done) + **`git-operations-pro`**
- **Input:** completed work — `report_ticket.md`, `summary.md`, `message.txt` / commits per [`references/conventions.md`](../../ex/ticket/references/conventions.md); branch/PR hygiene per [`git-operations-pro`](../../skills/git-operations-pro/references/commits-and-branching.md).
- **Output:** `closing_reports`

### Step 7 — `bundle-hygiene` (if skills changed in Step 2)

- **Type:** skill
- **Skill:** `skills-self-review-pro` + **`repo-tooling-pro`**
- **Input:** optional full-tree audit after new skills landed.
- **Actions:**
  1. Run **`python scripts/validate_skills.py`** — must pass.
  2. Run **`python scripts/analyze_skills.py --self-review`** (add **`--include-template`** if validating the template too).
  3. Cross-check output against **`skills/SKILL_AUTHORING_RULES.md`** — [references/authoring-rules-crosscheck.md](../../skills/skills-self-review-pro/references/authoring-rules-crosscheck.md), [references/report-structure-and-scripts.md](../../skills/skills-self-review-pro/references/report-structure-and-scripts.md).
- **Output:** `report_md` + **`manual_followups`** — no authoring drift after new skills.

## Notes

- **`ex/ticket`** lives under **`ex/ticket/`** (not `skills/ticket/`); agents must open **`ex/ticket/SKILL.md`** for phase commands and paths.
- **`kanban/<ticket>/issue.md`**: if your team uses a single `issue.md` at ticket root, merge its content into **`plan.md`** / acceptance criteria — keep **`meta.json`** consistent with [`meta-schema.md`](../../ex/ticket/references/meta-schema.md).
- Optional **track JSON**: if you maintain a separate `track.json` for board status, mirror phase/status fields from **`meta.json`** to avoid two sources of truth, or document one as canonical in your project `kanban/README.md`.
