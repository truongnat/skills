---
name: execution
description: "Execute TASKS.md guided by PLAN.md: modify files, run verification, record EXECUTION.md, handle failures, and handoff to review. (Hard contract in this SKILL.md — MUST follow.)"
---

# Execution

## Purpose

Execute locked work from TASKS.md (task cards + order), guided by PLAN.md strategy/DoD/rollback, in a controlled and verifiable way.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | TASKS.md (task cards + execution_order), PLAN.md (strategy/DoD/rollback), locked scope, repo context, affected files, constraints, verification commands. |
| Outputs | Workspace changes within scope, EXECUTION.md with files changed, commands run, verification evidence, blockers, deviations. |
| Safety | Do NOT modify outside scope. Execute by task ID from TASKS.md; use PLAN.md for DoD/rollback only. Do NOT put secrets in files/logs. Do NOT delete sensitive files/config/migration/data without a plan or confirmation. Do NOT revert changes not belonging to you without permission. Do NOT claim completion without verification or documenting skipped checks. |

### Required artifacts

#### `EXECUTION.md`
- Required: yes
- **plan_source** (required, string): Reference to PLAN.md and TASKS.md (or clear scope source).
- **current_task** (required, string): Task ID from TASKS.md currently being executed.
- **scope** (required, string): Scope this execution covers.
- **execution_log** (required, array): Step, Task ID, Action, Files, Result, Notes per step.
- **files_changed** (required, array): File path, change summary, reason, in-plan? (yes/deviation).
- **commands_run** (required, array): Command, purpose, result (pass/fail/skipped), notes.
- **verification_evidence** (required, array): Check name, command/method, result, evidence.
- **deviations** (optional, array): Deviation, reason, risk, follow-up.
- **issues_blockers** (optional, array): Issue, type, impact, next action.
- **rollback_notes** (required, string): How to roll back this execution.
- **final_status** (required, string): Completed / Partially completed / Blocked.
- **handoff** (required, string): Ready for review? Suggested focus area.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

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
