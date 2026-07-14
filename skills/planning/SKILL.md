---
name: planning
description: >-
  Step workflow: seed PLAN/TASKS templates then fill (strategy then micro-tasks).
  MUST copy templates to session, fill PLAN slim then TASKS, self-check. Implement
  before tests. (Hard contract in this SKILL.md — MUST follow.)
---

# Planning

## Purpose

Produce **two session files on disk** via a **forced step sequence** (BMAD-style micro-file):

1. Seed templates → `PLAN.md` + `TASKS.md`
2. Fill **PLAN.md** (strategy + task_index only)
3. Fill **TASKS.md** (micro-tasks from design)
4. Self-check before handoff

Prefer `DETAIL_DESIGN.md` when present. Do not invent architecture or contracts.

## Workflow architecture (mandatory)

This skill uses **sequential step files**. Obey:

- Read **one** step file fully and finish it before opening the next.
- **NEVER** skip step-01 (template seed).
- **NEVER** fill TASKS before PLAN step is done.
- **NEVER** claim complete until step-04 passes (or Ready=No with blockers).
- Do **not** dump full task cards into `PLAN.md`.

Skill root paths (relative to this skill):

| Path | Role |
|------|------|
| [templates/PLAN.template.md](./templates/PLAN.template.md) | Seed for session `PLAN.md` |
| [templates/TASKS.template.md](./templates/TASKS.template.md) | Seed for session `TASKS.md` |
| [steps/step-01-init.md](./steps/step-01-init.md) | Copy templates into session |
| [steps/step-02-fill-plan.md](./steps/step-02-fill-plan.md) | Fill PLAN strategy only |
| [steps/step-03-fill-tasks.md](./steps/step-03-fill-tasks.md) | Fill TASKS micro-cards |
| [steps/step-04-self-check.md](./steps/step-04-self-check.md) | Verify + handoff |

### Execution entry

**Start here:** Read and follow [steps/step-01-init.md](./steps/step-01-init.md) immediately after this Contract.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action.

| Field | Requirement |
|-------|-------------|
| Inputs | DETAIL_DESIGN.md when present; else BASIC_DESIGN.md / DISCUSSION.md / BA notes; user request; codebase mapping; constraints. |
| Outputs | Session folder MUST contain filled `PLAN.md` + `TASKS.md` seeded from templates. Incomplete if PLAN-only, chat-only, or tasks embedded in PLAN. |
| Safety | Do NOT implement code. Do NOT skip steps. Do NOT finish without both files on disk. Do NOT put `### T-00x` AC/Verify/Files bodies in PLAN.md. Do NOT make first tasks a test-case matrix before feature code. Do NOT emit epic-level tasks when design has detail (see step-03 size rules). Do NOT set Handoff Ready=Yes while blockers remain. Do NOT invent file paths without inspect. Do NOT treat assumptions as confirmed. Do NOT skip rollback for destructive changes. |

### Required artifacts

#### `PLAN.md` (from template)
Strategy only: goal, scope, non_goals, assumptions, approach, affected_areas, test_strategy (optional), verification_strategy, definition_of_done, rollback_strategy, risks, **task_index** (ID + title only), handoff.

#### `TASKS.md` (from template)
plan_ref, execution_order, micro-task cards (Trace, Depends, Description, AC, Verify, Files/scope, confidence, status). Implement before automated tests.

### Reference

`agents/openai.yaml` mirrors contract for tooling. **Steps + templates in this skill folder are authoritative for execution order.**

## Forbidden outputs (reject / rewrite)

| Failure | Fix |
|---------|-----|
| No template seed (wrote files free-form only) | Restart at step-01 |
| Only `PLAN.md` | Continue step-03 |
| Full task cards inside `PLAN.md` | Move cards to `TASKS.md`; slim PLAN |
| T-001 = test matrix before code | Reorder: implement then tests |
| Epic / multi-layer / ≥3 deliverables in one card | Split per step-03 Task size |
| Ready=Yes with open Blockers (or DISCUSSION blockers ignored) | Set Ready=No; copy blockers; re-run step-04 |

## What a TASK is

- Traceable to design/BA (`Trace:` required).
- One concern (not entire screen/service).
- Independently verifiable after deps exist.
- Order: models → service → API → UI → **then** tests.

## Lite Mode

Still run **all four steps**. TASKS may have 1–3 cards; templates still required.

## Limitations

- Does NOT implement code.
- Does NOT replace design skills when contracts/architecture are missing (non-Lite).
- Does NOT require tests-before-code.
