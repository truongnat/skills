---
name: review
description: Review changes after execution: bugs, regression, missing tests, security/data risks, maintainability, and readiness before done/PR.
---

# Review

## Purpose

Evaluate changes after execution before marking done, creating a PR, or handing off.

## XML Contract

```xml
<Contract>
  <Inputs>Diff/file changes, PLAN.md, EXECUTION.md, test/check results, verification evidence, scope/context.</Inputs>
  <Outputs>REVIEW.md with scope reviewed, findings, testing gaps, residual risks, recommendation, handoff.</Outputs>
  <Artifacts>
    <File name="REVIEW.md" required="true">
      <Schema>
        <field name="scope_reviewed" type="string" required="true">What changes were reviewed.</field>
        <field name="inputs" type="array" required="true">What was read: PLAN.md, EXECUTION.md, diff, test results.</field>
        <field name="findings" type="array" required="false">Finding ID, severity, category, location, evidence, impact, recommendation, confidence.</field>
        <field name="requirement_coverage" type="array" required="true">Requirement/task, covered by change? evidence, notes.</field>
        <field name="verification_reviewed" type="array" required="true">Check, result, evidence, concern.</field>
        <field name="testing_gaps" type="array" required="false">Gap, risk, suggested follow-up.</field>
        <field name="residual_risks" type="array" required="false">Risk, impact, acceptance/mitigation.</field>
        <field name="recommendation" type="string" required="true">Ready / Ready with risks / Needs fix / Blocked / Needs more verification.</field>
      </Schema>
    </File>
  </Artifacts>
  <Safety>Do NOT auto-fix code if user only requested review. Do NOT create findings without evidence. Do NOT claim safe if verification is missing. Do NOT ignore security/data risks when changes touch input, auth, permission, secrets, files, network, DB, or infra.</Safety>
</Contract>
```

## Quality Standards

- [ ] Every finding has severity (Critical/High/Medium/Low/Info).
- [ ] Every finding has evidence (file path, line, or diff context).
- [ ] No findings → explicitly state "No findings found" + document residual risks.
- [ ] Security/data/migration risks checked if changes touch those areas.
- [ ] Recommendation uses one of: Ready / Ready with risks / Needs fix / Blocked / Needs more verification.

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
- If fixes are needed, return to planning or execution.
