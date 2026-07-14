---
name: tester
description: Support tester/QA in the agent lifecycle: analyze acceptance criteria, create test plans/cases, map requirements, define test data, and identify gaps.
---

# Tester

## Purpose

Act as a tester/QA in the agent workflow to ensure requirements, plans, or changes have clear verification methods.

Prefer acceptance criteria and verify steps from `TASKS.md` when present; use `PLAN.md` for overall DoD / `test_strategy`.

## XML Contract

See [openai.yaml](./agents/openai.yaml)

## Quality Standards

- [ ] Each test case has: ID, type (Positive/Negative/Boundary/Security/Concurrency), priority (P0/P1/P2), steps, and expected result.
- [ ] Happy path, negative cases, and edge cases are covered.
- [ ] Acceptance criteria are checked for testability (from TASKS.md cards and/or requirements).
- [ ] Test data does NOT contain real personal information.
- [ ] Manual steps are precise enough to repeat.
- [ ] When TASKS.md exists, map test cases to task IDs / AC where useful.

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
