---
name: execution
description: Execute TASKS.md guided by PLAN.md: modify files, run verification, record EXECUTION.md, handle failures, and handoff to review.
---

# Execution

## Purpose

Execute locked work from TASKS.md (task cards + order), guided by PLAN.md strategy/DoD/rollback, in a controlled and verifiable way.

## XML Contract

See [openai.yaml](./agents/openai.yaml)

## Quality Standards

- [ ] Every modified file is listed with a change summary.
- [ ] Every verification command has a result (pass/fail/skipped).
- [ ] Skipped checks have a documented reason and risk.
- [ ] Pre-existing failures are labeled "pre-existing" with evidence.
- [ ] Work follows TASKS.md IDs and execution_order; PLAN.md DoD/rollback are respected.
- [ ] Deviations from PLAN/TASKS are documented with justification.
- [ ] Rollback notes exist for all changed areas.

## WRONG vs CORRECT

```markdown
// WRONG — claiming done without evidence
Fixed the bug. Done.

// CORRECT — verification attached
Fix: Added null check before decrypting initial password.
Verify: `pnpm test -- password` — passed (3 tests, 0 failed).
Manual: Called endpoint with affected user — returns 200 with empty password field.
```

```markdown
// WRONG — hiding a failure
All checks passed.

// CORRECT — honest about failures
Checks:
- lint: passed
- typecheck: passed
- test: FAILED (2 pre-existing failures in unrelated payment tests, 0 new failures)
- e2e: skipped (browser env unavailable)
```

## Edge Cases

| Situation | Handling |
|---|---|
| Verification command does not exist | Note as "command unknown", add investigation to find it. |
| Fix causes new test failures | Fix within scope and re-verify. If out of scope, document as deviation. |
| Pre-existing test failures unrelated to task | Document with evidence (e.g., "failed on main branch too"). Do NOT claim these as your issue. |
| Lockfile changed unexpectedly | Document as deviation, state whether it's safe. |
| User asks to stop mid-execution | Record partial state in EXECUTION.md. Handoff with incomplete tasks listed. |

## Limitations

- Does NOT do independent review; use review after execution.
- Does NOT replace planning for complex tasks.
- Does NOT replace investigate when root cause is unknown.
