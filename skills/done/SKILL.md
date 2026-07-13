---
name: done
description: Close a task after execution/review with DONE.md, PR_MESSAGE.md, PR_DESCRIPTION.md, and optional RELEASE_NOTE.md.
---

# Done

## Purpose

Close a task with clear, honest, reviewable artifacts.

## XML Contract

```xml
<Contract>
  <Inputs>PLAN.md, EXECUTION.md, REVIEW.md, diff/file changes, verification evidence, skipped checks, blockers, risks, PR/MR template.</Inputs>
  <Outputs>DONE.md, PR_MESSAGE.md, PR_DESCRIPTION.md, optional RELEASE_NOTE.md.</Outputs>
  <Artifacts>
    <File name="DONE.md" required="true">
      <Schema>
        <field name="status" type="string" required="true">Done / Done with risks / Needs fix / Blocked / Partial.</field>
        <field name="summary" type="string" required="true">Outcome-focused summary (not file list).</field>
        <field name="scope_completed" type="array" required="true">Scope item, status, evidence.</field>
        <field name="what_changed" type="array" required="true">Area, change summary, reason.</field>
        <field name="files_changed" type="array" required="true">File path, summary.</field>
        <field name="verification" type="array" required="true">Check, command/method, result, evidence.</field>
        <field name="review_result" type="string" required="false">Findings and resolution, or "No findings."</field>
        <field name="skipped_failed_checks" type="array" required="false">Check, status, reason, risk.</field>
        <field name="risks_followups" type="array" required="false">Item, type (risk/follow-up/blocker), impact, owner/next action.</field>
        <field name="handoff" type="string" required="true">Next step, reviewer focus, QA focus, deployment notes.</field>
      </Schema>
    </File>
    <File name="PR_MESSAGE.md" required="false">Conventional commit format: feat/fix/refactor(scope): summary.</File>
    <File name="PR_DESCRIPTION.md" required="false">Summary, Changes, Verification, Review Notes, Risks/Follow-ups.</File>
    <File name="RELEASE_NOTE.md" required="false">Only when change is user-facing or user requests it.</File>
  </Artifacts>
  <Safety>Do NOT overclaim verification. Do NOT hide skipped/failed checks. Do NOT mark complete if blockers remain. Do NOT describe changes that were not made. Do NOT put secrets into final artifacts.</Safety>
</Contract>
```

## Quality Standards

- [ ] Final status is one of: Done / Done with risks / Needs fix / Blocked / Partial.
- [ ] Summary describes outcome, not a file list.
- [ ] Verification distinguishes: passed / failed / skipped / not run.
- [ ] No failed check is marked as passed.
- [ ] Review result is included.
- [ ] PR_MESSAGE.md follows Conventional Commits format.
- [ ] PR_DESCRIPTION.md answers: what changed, why, how verified, reviewer focus.

## WRONG vs CORRECT

```markdown
// WRONG — file list instead of outcome
Changed: teacher-form.tsx, teacher-service.ts, teacher-test.ts

// CORRECT — outcome-focused
Summary: Preserved teacher list search state when navigating back from detail page,
including year filter restoration and search keyword persistence.
```

```markdown
// WRONG — hiding skipped checks
Verification: all passed.

// CORRECT — honest reporting
Verification:
- typecheck: passed
- lint: passed
- unit tests: skipped (test database not available)
- e2e: skipped (browser setup unavailable)
Residual risk: Main flow not verified by automated tests. Manual check done.
```

## Edge Cases

| Situation | Handling |
|---|---|
| Task has blockers | Status = Blocked. DONE.md records blocker and suggested next action. Do NOT create PR artifacts. |
| No PR template found in repo | Use fallback template from this skill. Document in notes. |
| User only needs summary, no PR | Use Lite Mode. No file creation needed. |
| Review found issues that were fixed | Document finding → resolution → evidence in review_result section. |
| Scope changed during execution | Document deviation in DONE.md. Note whether deviation was reviewed. |

## Limitations

- Does NOT auto-fix code.
- Does NOT turn unverified tasks into done.
- If review found blockers, return to execution before done.
