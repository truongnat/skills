---
name: execution
description: Execute a plan or agreed scope: modify files, run verification, record EXECUTION.md, handle failures, and handoff to review.
---

# Execution

## Purpose

Execute a locked plan in a controlled, safe, and verifiable way.

## XML Contract

```xml
<Contract>
  <Inputs>PLAN.md, locked scope, repo context, affected files, constraints, verification commands.</Inputs>
  <Outputs>Workspace changes within scope, EXECUTION.md with files changed, commands run, verification evidence, blockers, deviations.</Outputs>
  <Artifacts>
    <File name="EXECUTION.md" required="true">
      <Schema>
        <field name="plan_source" type="string" required="true">Reference to PLAN.md or scope source.</field>
        <field name="current_task" type="string" required="true">Task ID currently being executed.</field>
        <field name="scope" type="string" required="true">Scope this execution covers.</field>
        <field name="execution_log" type="array" required="true">Step, Task ID, Action, Files, Result, Notes per step.</field>
        <field name="files_changed" type="array" required="true">File path, change summary, reason, in-plan? (yes/deviation).</field>
        <field name="commands_run" type="array" required="true">Command, purpose, result (pass/fail/skipped), notes.</field>
        <field name="verification_evidence" type="array" required="true">Check name, command/method, result, evidence.</field>
        <field name="deviations" type="array" required="false">Deviation, reason, risk, follow-up.</field>
        <field name="issues_blockers" type="array" required="false">Issue, type, impact, next action.</field>
        <field name="rollback_notes" type="string" required="true">How to roll back this execution.</field>
        <field name="final_status" type="string" required="true">Completed / Partially completed / Blocked.</field>
        <field name="handoff" type="string" required="true">Ready for review? Suggested focus area.</field>
      </Schema>
    </File>
  </Artifacts>
  <Safety>Do NOT modify outside scope. Do NOT put secrets in files/logs. Do NOT delete sensitive files/config/migration/data without a plan or confirmation. Do NOT revert changes not belonging to you without permission. Do NOT claim completion without verification or documenting skipped checks.</Safety>
</Contract>
```

## Quality Standards

- [ ] Every modified file is listed with a change summary.
- [ ] Every verification command has a result (pass/fail/skipped).
- [ ] Skipped checks have a documented reason and risk.
- [ ] Pre-existing failures are labeled "pre-existing" with evidence.
- [ ] Deviations from plan are documented with justification.
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
