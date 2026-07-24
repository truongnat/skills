---
name: quick-fix
description: >-
  Tiny clear fix path (Path=Quick): create a short session note + 1–3 TASK cards
  with Dev context, then hand off to sync/execution. No BA, design, or Spec
  matrices. Use for one-line bugs and obvious small changes.
---

# Quick Fix

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Work layout +
Memory + Thinking methods + **Readable writing** + Scale) before Purpose,
Contract, or steps. Path must be **Quick**. If the change is unclear or needs
product/design decisions, stop and upgrade to Lite/Full (`brainstorming` /
`planning`).

## Purpose

Ship a **small, clear** change without Full lifecycle ceremony.

## Contract (mandatory)

| Field | Requirement |
|-------|-------------|
| Inputs | Clear user ask; repo readable; `.agents/settings.yaml` |
| Outputs | Session with `QUICK.md` + `TASKS.md` (1–3 cards with Dev context) + `CONTEXT.md` via `build_context.py`; Path=`Quick` recorded |
| Safety | **Forbidden on Quick:** `BUSINESS_ANALYSIS.md`, `BASIC_DESIGN.md`, `DETAIL_DESIGN.md`, Spec quality matrices, inventing product rules. Do NOT implement until sync readiness allows. If unknowns block → upgrade Path. |

### Required artifacts

#### `QUICK.md`
- Path: Quick
- Goal (one sentence), facts, out of scope, handoff (`sync` then `execution`)

#### `TASKS.md`
- 1–3 cards only; each with Work items, AC, Verify, Files/scope, **Dev context** + `[Source:]` or `No specific guidance found.`

## Workflow

1. `session.sh new <slug>` or `current`.
2. Write `QUICK.md` (template below in skill templates).
3. Write slim `TASKS.md` from planning template fields (cards only — inventory may be 1–3 rows).
4. `python .agents/tools/session/build_context.py`
5. `python .agents/tools/session/lint_artifacts.py`
6. Handoff: `sync` → need `PASS` (or `CONCERNS` + user OK) → `execution` → `review` → `done`.

## Quality Standards

- [ ] Path=Quick recorded; no BA/design files created.
- [ ] ≤3 TASK cards; each has Dev context with Source or explicit none.
- [ ] First-pass readable; no leftover `_(TODO)_`.
- [ ] Lint OK.

- [ ] Work nested git: ran `session.sh commit 'docs(quick-fix): …'` after writing artifacts (or `WORK_COMMIT=clean`). See AGENT_WORK.md.

## Limitations

- Does NOT replace brainstorming/planning for unclear work.
- Does NOT skip review/done for merge hygiene.
