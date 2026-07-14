---
name: review
description: "Review changes after execution: bugs, regression, missing tests, security/data risks, maintainability, and readiness before done/PR. (Hard contract in this SKILL.md — MUST follow.)"
---

# Review

## Purpose

Evaluate changes after execution before marking done, creating a PR, or handing off.

Compare the diff and `EXECUTION.md` against `PLAN.md` (DoD/scope) and `TASKS.md` when present (per-task AC and intended files).

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | Diff/file changes, PLAN.md, TASKS.md when present, EXECUTION.md, test/check results, verification evidence, scope/context. |
| Outputs | REVIEW.md with scope reviewed, findings, testing gaps, residual risks, recommendation, handoff. |
| Safety | Do NOT auto-fix code if user only requested review. Do NOT create findings without evidence. Do NOT claim safe if verification is missing. Do NOT ignore security/data risks when changes touch input, auth, permission, secrets, files, network, DB, or infra. |

### Required artifacts

#### `REVIEW.md`
- Required: yes
- **scope_reviewed** (required, string): What changes were reviewed.
- **inputs** (required, array): What was read: PLAN.md, TASKS.md, EXECUTION.md, diff, test results.
- **findings** (optional, array): Finding ID, severity, category, location, evidence, impact, recommendation, confidence.
- **requirement_coverage** (required, array): Requirement/task, covered by change? evidence, notes.
- **verification_reviewed** (required, array): Check, result, evidence, concern.
- **testing_gaps** (optional, array): Gap, risk, suggested follow-up.
- **residual_risks** (optional, array): Risk, impact, acceptance/mitigation.
- **recommendation** (required, string): Ready / Ready with risks / Needs fix / Blocked / Needs more verification.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Quality Standards

- [ ] Every finding has severity (Critical/High/Medium/Low/Info).
- [ ] Every finding has evidence (file path, line, or diff context).
- [ ] No findings → explicitly state "No findings found" + document residual risks.
- [ ] Security/data/migration risks checked if changes touch those areas.
- [ ] Recommendation uses one of: Ready / Ready with risks / Needs fix / Blocked / Needs more verification.
- [ ] When TASKS.md exists, check unfinished or unverified task IDs against EXECUTION evidence.

## WRONG vs CORRECT

```markdown
// WRONG — vague, no evidence
Code could be cleaner.

// CORRECT — specific, evidence-based
Finding H-001: Missing server-side permission check.
Location: `src/export/export-handler.ts`, no guard before processing request.
Evidence: UI hides export button, but API endpoint still accepts direct requests.
Impact: Unauthorized users can export data by calling the endpoint directly.
Recommendation: Add server-side permission check + negative API test.
Severity: High
```

```markdown
// WRONG — claiming safe without checking
No security issues found.

// CORRECT — qualified statement
Security check:
- Auth: no changes touched auth middleware.
- Permission: server-side guard not added (Finding H-001).
- Input: existing validation still in place.
- Secrets: no new secrets introduced.
Residual risk: Missing permission check needs to be addressed before merge.
```

## Edge Cases

| Situation | Handling |
|---|---|
| No review findings | State "No findings found" explicitly. Document residual risks. |
| User only asks "is this ready?" | Answer with recommendation status — if blocked, explain why. |
| Review input is incomplete (no diff) | Document limitation in scope. Do NOT claim full review. |
| Pre-existing issue found during review | Document as info finding. Note it's pre-existing, not introduced. |
| Security review without enough context | Document as testing gap. Do NOT claim security is safe. |

## Limitations

- Does NOT auto-fix code.
- Does NOT replace full QA or deep security audit.
- If fixes are needed, return to planning (update PLAN/TASKS) or execution.
