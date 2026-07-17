---
name: business-analysis
description: "Clarify business problems, stakeholder needs, scope, processes, user stories, business rules, data sources, assumptions, acceptance criteria, and functional specs before basic design, planning, or testing. (Hard contract in this SKILL.md — MUST follow.)"
---

# Business Analysis

## Purpose

Clarify business requirements before basic design, planning, implementation, or testing.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | User request, business context, existing requirements, data samples (Excel, CSV, SQL, JSON, API response), screenshots or demo recordings, stakeholder feedback. |
| Outputs | `BUSINESS_ANALYSIS.md`: problem statement, stakeholders, scope, user stories/use cases, business rules, data assumptions, acceptance criteria, open questions, handoff. |
| Safety | Do NOT treat assumptions as requirements. Do NOT decide for stakeholders. Do NOT write vague or untestable acceptance criteria. Do NOT produce technical architecture — hand off to basic-design. |

### Required artifacts

#### `BUSINESS_ANALYSIS.md`
- Required: yes.
- **executive_summary** (required, array): Maximum five bullets with the problem, key rule/decision, top risk, and next action.
- **developer_overview** (required, object): Status, top rules/AC gaps, open questions, next action.
- **charts** (optional, array): Mermaid process/actor flow when useful; otherwise N/A.
- **context_5w1h** (optional, object): What, Why, Who, When, Where, How when useful; use Unknown/N/A explicitly.
- **problem_statement** (required, string): One-sentence business problem.
- **stakeholders** (required, array): Actor, goal, pain point, authority.
- **scope** (required, object): In scope, out of scope, non-goals.
- **user_stories** (required, array): ID, actor, need, value.
- **business_rules** (required, array): BR ID, rule, source, confidence.
- **data_assumptions** (optional, array): Assumption, risk, confirmation owner.
- **acceptance_criteria** (required, array): AC ID, Given/When/Then, rule mapping.
- **open_questions** (required, array): Question, owner, blocking status.
- **handoff** (required, string): Recommended next skill and readiness.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Quality Standards

- [ ] Problem statement is one sentence.
- [ ] Stakeholders/actors are listed with role and pain point.
- [ ] Business rules have IDs (BR-001, BR-002) for traceability.
- [ ] Acceptance criteria use Given/When/Then format.
- [ ] Assumptions are separated from confirmed requirements.
- [ ] Open questions have owners (if known) and blocking status.
- [ ] Handoff to next skill is specified (usually basic-design when technical work follows).
- [ ] When a demo recording is supplied, relevant sampled frames are cited as sources and interpretation gaps are kept as open questions.

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
| Demo recording is supplied | Extract keyframes with `.agents/tools/video-keyframes/extract.py`; cite frames as observed UI/process evidence, not stakeholder-approved requirements. |

## Limitations

- Does NOT replace stakeholder decisions.
- Does NOT auto-implement.
- Does NOT auto-confirm business rules without a source.
- Does NOT produce technical architecture — hand off to basic-design (then detail-design) when technical work follows.
- Does NOT replace planning.
