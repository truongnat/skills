---
targets:
  - cursor
  - claude
---

# /w-refactor — Run the safe refactor workflow

You are executing the **refactor** workflow (**file** [`workflows/dev/w-refactor.md`](../workflows/dev/w-refactor.md)).

## User input

$ARGUMENTS

## Instructions

1. **Read** [`workflows/dev/w-refactor.md`](../workflows/dev/w-refactor.md) in full.
2. **Resolve inputs:** `refactor_goal`, `target_scope` (required); optional `domain_stack`.
3. **Safety net first** — tests or characterization tests before behavior-changing edits.

## Rules

- Do not mix **behavior changes** with refactor in the same step set.
