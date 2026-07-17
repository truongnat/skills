# Tasks

> Filled by planning step-03. **Work inventory first**, then micro-task cards.
> **Implement feature code before automated tests.** Do not leave template placeholders.
> **Progress:** planning seeds Status=`todo` and unchecked boxes; **execution** updates them as work completes.

plan_ref: PLAN.md

## Status legend

| Value | Meaning |
|-------|---------|
| `todo` | Not started |
| `in_progress` | Currently executing |
| `done` | Card AC verified for this task |
| `blocked` | Cannot proceed (note reason under Notes or on the card) |
| `skipped` | Intentionally not done (document why) |

## Work inventory

<!-- Mandatory for Full Mode. One row per implementable unit from design. -->

| Inv | Unit (noun + verb) | Trace (doc § / AC / contract) | Layer |
|-----|--------------------|-------------------------------|-------|
| I-01 | _(TODO — replace; e.g. Add SearchRequest fields: …)_ | _(doc §)_ | model |

## Progress board

<!-- One row per task card. Execution updates Status + Done when a card finishes. -->

| Done | ID | Title | Status |
|------|----|-------|--------|
| [ ] | T-001 | _(short title)_ | todo |
| [ ] | T-002 | _(short title)_ | todo |

## Execution order

<!-- Must match PLAN.md Task index IDs after cards are written. -->

T-001 → T-002 → _(extend)_

## Notes

- _(optional: blockers, pattern refs, why inventory was split this way)_

## Tasks

### T-001: _(short title — concrete unit, not only a layer)_

- Status: todo
- Trace: _(doc § / AC / contract id — required)_
- Depends: none
- Work items:
  - [ ] 1. _(concrete step: symbol / field / behavior)_
  - [ ] 2. _(concrete step)_
- Description: _(1–2 lines summary of the card; details live in Work items)_
- AC: _(observable outcome — not “works” / “per spec”)_
- Verify: _(command, request, or UI check for this card only)_
- Files/scope: _(concrete path or create `…/File.ext`)_ (confidence: known | inferred | unknown)
- Out of scope for this card: _(what the next cards own)_

### T-002: _(short title)_

- Status: todo
- Trace: _(…)_
- Depends: T-001
- Work items:
  - [ ] 1. _(…)_
  - [ ] 2. _(…)_
- Description: _(…)_
- AC: _(…)_
- Verify: _(…)_
- Files/scope: _(…)_ (confidence: known | inferred | unknown)
- Out of scope for this card: _(…)_

<!-- Duplicate ### T-00x as needed. Map ~1 inventory row → 1 card. -->
<!-- Delete unused placeholders. Put automated tests AFTER implement cards. -->
<!-- Keep Progress board rows in sync with card Status and Done checkboxes. -->
