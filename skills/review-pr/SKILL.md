---
name: review-pr
description: Review pull requests, merge requests, or branch diffs as a responsible code reviewer. Quality gate before merge.
---

# Review PR

## Purpose

Review a PR/MR or branch diff as a quality-responsible reviewer before merge.

## XML Contract

```xml
<Contract>
  <Inputs>PR diff, branch diff, base/head, PR description, changed files, test/CI results, codebase context.</Inputs>
  <Outputs>REVIEW_PR.md with scope, findings, testing gaps, residual risks, PR description coverage, merge recommendation.</Outputs>
  <Artifacts>
    <File name="REVIEW_PR.md" required="true">
      <Schema>
        <field name="base" type="string" required="true">Base branch or commit.</field>
        <field name="head" type="string" required="true">Head branch or commit.</field>
        <field name="pr_description_accuracy" type="string" required="true">Does the diff match the description? yes/partial/no.</field>
        <field name="changed_areas" type="array" required="true">Area, files, risk level, notes.</field>
        <field name="findings" type="array" required="false">Finding ID, severity, category, location, evidence, impact, recommendation, confidence.</field>
        <field name="verification_reviewed" type="array" required="true">Check, result (pass/fail/skipped/missing), evidence, concern.</field>
        <field name="testing_gaps" type="array" required="false">Gap, risk, suggested follow-up.</field>
        <field name="residual_risks" type="array" required="false">Risk, impact, acceptance/mitigation.</field>
        <field name="merge_recommendation" type="string" required="true">Approve / Approve with comments / Request changes / Needs more info / Needs more verification / Blocked.</field>
      </Schema>
    </File>
  </Artifacts>
  <Safety>Do NOT auto-fix the PR if the user only requested review. Do NOT approve on behalf of the user. Do NOT create findings without evidence. Do NOT claim merge-safe if verification is missing. Do NOT ignore security/data risks.</Safety>
</Contract>
```

## Quality Standards

- [ ] PR description is checked against actual diff (coverage column).
- [ ] Each finding has severity, file/location, evidence, and recommendation.
- [ ] Finding severity is one of: Critical / High / Medium / Low / Info.
- [ ] Merge recommendation is one of the defined taxonomy.
- [ ] Security/auth/permission is reviewed if changes touch those areas.
- [ ] Testing gaps are documented even when no blocker findings exist.

## WRONG vs CORRECT

```markdown
// WRONG — no severity, no location
LGTM but there's a minor issue with the naming.

// CORRECT — structured finding
Finding PR-001: Medium — Export button text is misleading for unauthorized users.
Location: `src/features/export/export-button.tsx`, line 15.
Evidence: Button reads "Export All" but the endpoint rejects the request for unauthorized users.
Impact: UX confusion — users see an enabled button that will fail.
Recommendation: Disable the button text to "Export (not available)" for unauthorized roles.
Confidence: High.
```

```markdown
// WRONG — ignoring missing tests
No tests changed, but that's fine.

// CORRECT — calling out testing gaps
Testing gap: No new tests for the export permission check.
Risk: Regression may not be caught.
Follow-up: Add a negative API permission test.
```

## Edge Cases

| Situation | Handling |
|---|---|
| PR has no description | Document as an issue. PR description should explain what and why. |
| Diff is very large (>20 files) | Group by area. Note the size risk. Flag if changes are too broad. |
| Lockfile changes without manifest changes | Flag as potential unintended dependency change. |
| Binary files in the diff | Note they cannot be code-reviewed. Flag if large or unexpected. |
| CI evidence is missing | Note as testing gap. If changes are high-risk, recommend Needs more verification. |

## Limitations

- Does NOT auto-fix the PR.
- Does NOT replace deep security audit.
- Does NOT guarantee finding all bugs if evidence is insufficient.
