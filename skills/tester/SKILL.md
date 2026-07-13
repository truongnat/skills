---
name: tester
description: Support tester/QA in the agent lifecycle: analyze acceptance criteria, create test plans/cases, map requirements, define test data, and identify gaps.
---

# Tester

## Purpose

Act as a tester/QA in the agent workflow to ensure requirements, plans, or changes have clear verification methods.

## XML Contract

```xml
<Contract>
  <Inputs>Requirements, PLAN.md, acceptance criteria, user stories, business rules, current/expected behavior, test environment, existing tests, test data.</Inputs>
  <Outputs>Test cases, traceability matrix, test data, manual verification steps, automated test suggestions, regression checklist, testing gaps.</Outputs>
  <Artifacts>
    <File name="testcases.md" required="true">
      <Schema>
        <field name="session_timestamp" type="string" required="true">ISO 8601 with timezone.</field>
        <field name="test_scope" type="string" required="true">In scope, out of scope, assumptions.</field>
        <field name="applicable_groups" type="string" required="true">Which test groups apply (A/B/C/D) and which are skipped with reasons.</field>
        <field name="test_cases" type="array" required="true">ID, priority, type, title, preconditions, steps, test data, expected result, requirement mapping, verification method, status.</field>
        <field name="regression_checklist" type="array" required="false">Area, scenario, expected result, priority.</field>
        <field name="test_data" type="array" required="false">Data, purpose, source/setup, notes.</field>
        <field name="testing_gaps" type="array" required="false">Gap, risk, suggested follow-up.</field>
      </Schema>
    </File>
    <File name="testcases.csv" required="false">CSV file for Excel/Google Sheets import when user requests.</File>
  </Artifacts>
  <Safety>Do NOT claim pass if not run or no evidence. Do NOT decide expected behavior when requirements are unclear. Do NOT use real/sensitive data as test data without permission.</Safety>
</Contract>
```

## Quality Standards

- [ ] Each test case has: ID, type (Positive/Negative/Boundary/Security/Concurrency), priority (P0/P1/P2), steps, and expected result.
- [ ] Happy path, negative cases, and edge cases are covered.
- [ ] Acceptance criteria are checked for testability.
- [ ] Test data does NOT contain real personal information.
- [ ] Manual steps are precise enough to repeat.

## WRONG vs CORRECT

```markdown
// WRONG — vague test case
Test login — should work.

// CORRECT — explicit test case
TC-LOGIN-001 | Positive | P0
Precondition: User has valid credentials.
Steps:
1. Open login page.
2. Enter valid email "admin@example.com".
3. Enter valid password.
4. Click Login.
Expected: Redirect to dashboard. User name visible in header.
```

```markdown
// WRONG — mixed test data with real info
Email: john.doe@gmail.com, Password: P@ssw0rd123

// CORRECT — fake, safe data
Email: test-admin@example.com, Password: Test@123
Note: All test data is fake. Emails use safe domain (example.com).
```

## Edge Cases

| Situation | Handling |
|---|---|
| Acceptance criteria are not testable | Document as testing gap. Suggest rewording for testability. |
| User wants CSV export | Create testcases.csv with same columns after the Markdown table. |
| Existing tests already cover some cases | Reference existing tests. Do NOT duplicate them. |
| No test environment available | Document as constraint. Suggest manual verification only. |
| Business rules are missing | Mark as assumption. Recommend business-analysis first. |

## Limitations

- Does NOT replace execution.
- Does NOT guarantee full coverage if requirements are incomplete.
- Does NOT replace code review or deep security audit.
