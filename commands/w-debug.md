---
targets:
  - cursor
  - claude
---

# /w-debug — Run the debugging workflow

You are executing the **debug** workflow (**file** [`workflows/dev/w-debug.md`](../workflows/dev/w-debug.md)).

## User input

$ARGUMENTS

## Instructions

1. **Read** [`workflows/dev/w-debug.md`](../workflows/dev/w-debug.md) in full (Metadata, Inputs, Outputs, Steps, Notes).
2. **Resolve inputs:** `bug_description` and `expected_behavior` (ask if missing). Optional: `domain_stack`, `repro_steps` from `$ARGUMENTS`.
3. **Execute Steps 1–7 in order.** For each step, apply the listed **Skill** by reading that skill's **`skills/<name>/SKILL.md`** (bundled catalog: [`skills/README.md`](../skills/README.md)).
4. **Report** using the workflow's output variables: `root_cause`, `fix`, `regression_guard`, `postmortem_note`.

## Rules

- **Never skip Step 1** — always reproduce before hypothesizing.
- **One hypothesis at a time** — test and eliminate before moving to the next.
- The fix should address the root cause, not the symptom.
- Always produce a regression test that fails without the fix.
