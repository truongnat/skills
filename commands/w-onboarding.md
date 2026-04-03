---
targets:
  - cursor
  - claude
---

# /w-onboarding — Run the onboarding workflow

You are executing the **onboarding** workflow (**file** [`workflows/dev/w-onboarding.md`](../workflows/dev/w-onboarding.md)).

## User input

$ARGUMENTS

## Instructions

1. **Read** [`workflows/dev/w-onboarding.md`](../workflows/dev/w-onboarding.md) in full.
2. **Resolve inputs:** `onboarding_role` (required); optional `time_budget`, `focus_area`.
3. **Execute** steps; use [`AGENTS.md`](../AGENTS.md) and [`skills/README.md`](../skills/README.md) when this repo is the target project.

## Rules

- If repository access is missing, output a **checklist** instead of guessing file contents.
