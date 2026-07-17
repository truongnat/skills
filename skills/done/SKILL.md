---
name: done
description: "Close a task after execution/review with DONE.md, PR_MESSAGE.md, PR_DESCRIPTION.md, and optional RELEASE_NOTE.md. (Hard contract in this SKILL.md — MUST follow.)"
---

# Done

## Purpose

Close a task with clear, honest, reviewable artifacts.

Prefer inputs from `EXECUTION.md`, `REVIEW.md`, `PLAN.md` (DoD/rollback), and `TASKS.md` when present (task completion vs intended cards).

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | PLAN.md, TASKS.md when present, EXECUTION.md, REVIEW.md, diff/file changes, verification evidence, skipped checks, blockers, risks, PR/MR template. |
| Outputs | DONE.md, PR_MESSAGE.md, PR_DESCRIPTION.md, optional RELEASE_NOTE.md. |
| Safety | Do NOT overclaim verification. Do NOT hide skipped/failed checks. Do NOT mark complete if blockers remain. Do NOT describe changes that were not made. Do NOT put secrets into final artifacts. |

### Required artifacts

#### `DONE.md`
- Required: yes
- **executive_summary** (required, array): Maximum five bullets with final status, delivered value, verification, residual risk, and next action.
- **context_5w1h** (optional, object): What, Why, Who, When, Where, How when useful; use Unknown/N/A explicitly.
- **status** (required, string): Done / Done with risks / Needs fix / Blocked / Partial.
- **summary** (required, string): Outcome-focused summary (not file list).
- **scope_completed** (required, array): Scope item, status, evidence.
- **what_changed** (required, array): Area, change summary, reason.
- **files_changed** (required, array): File path, summary.
- **verification** (required, array): Check, command/method, result, evidence.
- **review_result** (optional, string): Findings and resolution, or 'No findings.'
- **skipped_failed_checks** (optional, array): Check, status, reason, risk.
- **risks_followups** (optional, array): Item, type (risk/follow-up/blocker), impact, owner/next action.
- **handoff** (required, string): Next step, reviewer focus, QA focus, deployment notes.

#### `PR_MESSAGE.md`
- Required: no
- Conventional commit format: feat/fix/refactor(scope): summary.

#### `PR_DESCRIPTION.md`
- Required: no
- Summary, Changes, Verification, Review Notes, Risks/Follow-ups.

#### `RELEASE_NOTE.md`
- Required: no
- Only when change is user-facing or user requests it.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Quality Standards

- [ ] Final status is one of: Done / Done with risks / Needs fix / Blocked / Partial.
- [ ] Summary describes outcome, not a file list.
- [ ] Verification distinguishes: passed / failed / skipped / not run.
- [ ] No failed check is marked as passed.
- [ ] Review result is included.
- [ ] PR_MESSAGE.md follows Conventional Commits format.
- [ ] PR_DESCRIPTION.md answers: what changed, why, how verified, reviewer focus.
- [ ] When TASKS.md exists, DONE summary reflects completed vs remaining task IDs honestly (use Progress board / Status / checkboxes; do not claim Done if open `todo`/`in_progress`/`blocked` IDs remain without documented blockers).

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
