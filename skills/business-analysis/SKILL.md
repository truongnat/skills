---
name: business-analysis
description: Clarify business problems, stakeholder needs, scope, processes, user stories, business rules, data sources, assumptions, acceptance criteria, and functional specs.
---

# Business Analysis

## Purpose

Clarify business requirements before planning, technical design, implementation, or testing.

## XML Contract

```xml
<Contract>
  <Inputs>User request, business context, existing requirements, data samples (Excel, CSV, SQL, JSON, API response), screenshots, stakeholder feedback.</Inputs>
  <Outputs>Requirement notes: problem statement, stakeholders, scope, user stories/use cases, business rules, data assumptions, acceptance criteria, open questions.</Outputs>
  <Safety>Do NOT treat assumptions as requirements. Do NOT decide for stakeholders. Do NOT write vague or untestable acceptance criteria.</Safety>
</Contract>
```

## Quality Standards

- [ ] Problem statement is one sentence.
- [ ] Stakeholders/actors are listed with role and pain point.
- [ ] Business rules have IDs (BR-001, BR-002) for traceability.
- [ ] Acceptance criteria use Given/When/Then format.
- [ ] Assumptions are separated from confirmed requirements.
- [ ] Open questions have owners (if known) and blocking status.

## WRONG vs CORRECT

```markdown
// WRONG — vague, untestable
The system should handle data well.

// CORRECT — specific, testable
BR-001: Admin users can create, update, deactivate, and export teacher accounts within their assigned school only.
AC-001: Given an admin user with school assignment X, when they open the teacher list, then only teachers in school X are shown.
```

```markdown
// WRONG — assumption presented as fact
Teacher ID is unique.

// CORRECT — assumption with caveat
ASM-001: We assume teacher ID is unique within a school year.
Risk if wrong: Import may merge wrong records.
Needs confirmation from: Product owner.
```

## Edge Cases

| Situation | Handling |
|---|---|
| Stakeholder feedback contradicts | Document both positions as open questions. Flag for resolution. |
| Requirement is too vague to write AC | Write best-effort AC. Mark as "needs clarification." |
| Data sample is inconsistent with description | Document the inconsistency. Recommend confirming which source is correct. |
| Business rules conflict with each other | Document the conflict. Flag to stakeholder for decision. |

## Limitations

- Does NOT replace stakeholder decisions.
- Does NOT auto-implement.
- Does NOT auto-confirm business rules without a source.
- Does NOT produce technical architecture.
