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
2. Run decision gate; **stop and ask** on unresolved Critical/blocking/visual
   decisions; then fill **PLAN.md**
3. Fill **TASKS.md** (micro-tasks from design)
4. Self-check before handoff

Prefer `DETAIL_DESIGN.md` when present. Do not invent architecture or contracts.

## Workflow architecture (mandatory)

This skill uses **sequential step files**. Obey:

- Read **one** step file fully and finish it before opening the next.
- **NEVER** skip step-01 (template seed).
- **NEVER** fill TASKS before PLAN step is done.
- **NEVER** fill strategy or TASKS while a Critical issue, blocking unknown, or
  unconfirmed `html-recommended` item is open.
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
| Inputs | DETAIL_DESIGN.md when present; else BASIC_DESIGN.md / DISCUSSION.md / BUSINESS_ANALYSIS.md; issue/visual triage and clarification answers; user request; codebase mapping; constraints. |
| Outputs | Session folder MUST contain filled `PLAN.md` + `TASKS.md` seeded from templates. `TASKS.md` MUST include Work inventory + specific micro-cards (not layer epithets only). Incomplete if PLAN-only, chat-only, tasks embedded in PLAN, empty template left, or vague epic cards. |
| Safety | Do NOT implement code. Do NOT skip steps. Stop and ask focused questions before strategy/tasks when Critical issues or blocking unknowns remain. Do NOT silently choose defaults. Planning classifies visual need but does not create HTML itself; route confirmed HTML needs to brainstorming/basic-design and resume after the decision. Do NOT finish without both files, set Ready=Yes with blockers, invent paths, or treat assumptions as confirmed. |

### Required artifacts

#### `PLAN.md` (from template)
Strategy only: executive_summary, developer_overview, charts (Mermaid when
useful), context_5w1h (when useful), pre_planning_decision_gate,
clarification_questions, visual_triage, goal, scope, non_goals, assumptions,
approach, affected_areas, test_strategy (optional), verification_strategy,
definition_of_done, rollback_strategy, risks, **task_index** (ID + title only),
handoff.

#### `OVERVIEW.md`
- Required: yes in the session folder.
- Refresh At a glance, progress chart, open decisions, and next action.

#### `TASKS.md` (from template)
Work inventory table, Progress board (Done checkbox + Status per ID), plan_ref, execution_order, micro-task cards (Trace with §/AC, Status=`todo`, Work items ≥2 as `- [ ] N. …`, Description, AC observable, Verify, Flow/comment notes, Files/scope concrete, confidence, out-of-scope). Implement before automated tests. Planning seeds progress; execution marks completion.

### Reference

`agents/openai.yaml` mirrors contract for tooling. **Steps + templates in this skill folder are authoritative for execution order.**

## Forbidden outputs (reject / rewrite)

| Failure | Fix |
|---------|-----|
| No template seed (wrote files free-form only) | Restart at step-01 |
| Only `PLAN.md` / TASKS still template placeholders | Continue/finish step-03 |
| Full task cards inside `PLAN.md` | Move cards to `TASKS.md`; slim PLAN |
| T-001 = test matrix before code | Reorder: implement then tests |
| No Work inventory / one “implement feature” row | Build inventory per step-03 §A |
| Epic / vague layer titles / multi-endpoint card | Split + add Work items + Trace § per step-03 §B–C |
| Ready=Yes with open Blockers (or DISCUSSION blockers ignored) | Set Ready=No; copy blockers; re-run step-04 |
| Filled strategy/tasks before Critical/blocking clarification | Stop, ask, record answer, then resume |
| Planning generated HTML without a visual decision handoff | Set Ready=No; route to brainstorming/basic-design |

## What a TASK is

- Traceable to a **design section / AC** (`Trace:` with § or id).
- One inventory unit (not entire screen/service/layer).
- Numbered **checkbox Work items** (`- [ ] 1. …`) an executor can follow and check off without re-reading the whole design.
- A **Progress board** row per card so status is visible at a glance.
- Independently verifiable after deps exist.
- Order: models → service → API → UI → **then** tests.

## Lite Mode

Still run **all four steps**. TASKS may have 1–3 cards; templates still required.

## Limitations

- Does NOT implement code.
- Does NOT replace design skills when contracts/architecture are missing (non-Lite).
- Does NOT require tests-before-code.
- Does NOT create visual HTML. It triages the need and blocks/hands off until
  the visual decision is resolved.
