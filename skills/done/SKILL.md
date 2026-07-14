---
name: done
description: Close a task after execution/review with DONE.md, PR_MESSAGE.md, PR_DESCRIPTION.md, and optional RELEASE_NOTE.md.
---

# Done

## Purpose

Close a task with clear, honest, reviewable artifacts.

Prefer inputs from `EXECUTION.md`, `REVIEW.md`, `PLAN.md` (DoD/rollback), and `TASKS.md` when present (task completion vs intended cards).

## XML Contract

See [openai.yaml](./agents/openai.yaml)

## Quality Standards

- [ ] Final status is one of: Done / Done with risks / Needs fix / Blocked / Partial.
- [ ] Summary describes outcome, not a file list.
- [ ] Verification distinguishes: passed / failed / skipped / not run.
- [ ] No failed check is marked as passed.
- [ ] Review result is included.
- [ ] PR_MESSAGE.md follows Conventional Commits format.
- [ ] PR_DESCRIPTION.md answers: what changed, why, how verified, reviewer focus.
- [ ] When TASKS.md exists, DONE summary reflects completed vs remaining task IDs honestly.

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
- When TASKS.md exists, do not claim Done if open task IDs remain without documented blockers.
- If review found blockers, return to execution before done.
