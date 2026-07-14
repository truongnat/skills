---
name: brainstorming
description: "Clarify goals, scope, constraints, options, trade-offs, risks, and recommendations before basic design, planning, or implementation. (Hard contract in this SKILL.md — MUST follow.)"
---

# Brainstorming

## Purpose

Turn an initial request into a clear direction before planning or implementing.

This skill focuses on:

- Clarify goals and expected outcomes.
- Separate facts, assumptions, and unknowns.
- Identify constraints, scope, out-of-scope, and non-goals.
- Analyze feasible solution directions.
- Compare trade-offs between options.
- Identify risks, uncertainties, and verification methods.
- Make a reasoned recommendation.
- Prepare handoff to business-analysis, basic-design, planning, or implementation.

The goal: help the team settle on the smallest, clearest, verifiable direction before investing larger effort.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | Initial request, repo context, existing documents, constraints, current behavior, desired outcome, stakeholder feedback if available. |
| Outputs | Light discussion or full DISCUSSION.md with goal, facts, assumptions, unknowns, constraints, scope, options, trade-offs, recommendation, risks, open questions, handoff to next skill. |
| Safety | Do NOT implement code during brainstorming. Do NOT treat assumptions as facts. Do NOT create detailed planning or design before a clear recommendation. Do NOT create large extra artifacts unless requested. |

### Required artifacts

#### `DISCUSSION.md`
- Required: yes
- **goal** (required, string): One sentence describing the goal.
- **desired_outcome** (required, string): What success looks like.
- **confirmed_facts** (required, array): Known facts from user, repo, or research.
- **constraints** (optional, array): Time, platform, tech stack, budget, tool limits.
- **assumptions** (optional, array): Assumptions with risk level and confirmation status.
- **unknowns** (optional, array): Open questions with blocking flag.
- **scope_in** (required, array): What is in scope.
- **scope_out** (required, array): What is out of scope.
- **non_goals** (optional, array): Goals explicitly not pursued.
- **options_considered** (required, table): Option, pros, cons, effort, risk, reversibility, verify method.
- **recommendation** (required, string): Recommended option with reason and confidence.
- **risks** (optional, array): Risks with impact and mitigation.
- **handoff** (required, string): Suggested next skill: business-analysis, basic-design, planning, research, or execution (Lite skip design when task is small/clear).

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## When to Use

Use this skill when:

- Starting a new task with unclear goals, scope, constraints, or solutions.
- User wants to discuss ideas before implementing.
- Multiple approaches exist and need trade-off analysis.
- Scope needs to be locked before planning.
- Need to define in-scope, out-of-scope, or non-goals.
- Need draft success criteria before moving to business-analysis, basic-design, or planning.
- Need to create or update DISCUSSION.md.
- Need alignment on product, UX, technical direction, or workflow.
- Need to decide between MVP, prototype, proof of concept, or phased delivery.
- Need to clarify risks, assumptions, or unknowns before detailed work.

## When NOT to Use

Do NOT use this skill when:

- Task is small, scope is clear, and can be fixed directly without discussion.
- Task already has a complete DISCUSSION.md and the user requests execution.
- Task has clear requirements/specs and only needs detailed planning.
- User requests code review, debug, or a specific bug investigation.
- User requests a small fix: typo, copy, style, import, simple config.
- User requests immediate implementation with low ambiguity.
- User needs detailed business requirement analysis; use business-analysis.
- User needs system-level or implementable technical design; use basic-design then detail-design.
- User needs deep external source research; use research.

## Quality Standards

- [ ] Goal is one clear sentence, not a paragraph.
- [ ] Facts, assumptions, and unknowns are separated.
- [ ] Scope, out-of-scope, and non-goals are separated.
- [ ] At least one option is analyzed; if multiple, comparison matrix is used.
- [ ] Recommendation has a reason, trade-off summary, and confidence level.
- [ ] Risks have both impact and mitigation.
- [ ] Handoff to next skill is specified.

## WRONG vs CORRECT

```markdown
// WRONG — vague, no recommendation
We could use option A or B. Both have pros and cons.

// CORRECT — clear recommendation with trade-off
Recommend: Option B — minimal prototype first.
Reason: Lowest risk, fastest to validate UX assumption.
Not A: Requires full architecture before validating user flow.
Confidence: Medium.
```

```markdown
// WRONG — assumptions mixed with facts
The user needs authentication.

// CORRECT — separated
Fact: The current system uses Keycloak 26.
Assumption: We can reuse existing Keycloak config (risk: may need custom scopes).
```

## Edge Cases

| Situation | Handling |
|---|---|
| User says "just decide for me" | Make best-effort recommendation but mark confidence and open questions. |
| No options exist yet | Recommend investigate first, or research external solutions. |
| Task is too small for full DISCUSSION.md | Use Lite Mode — 5 bullets max. |
| User contradicts earlier statement | Document both positions as open question, flag to stakeholder. |

## Limitations

- This skill does NOT implement code.
- This skill does NOT replace detailed planning.
- This skill does NOT replace business analysis.
- This skill does NOT replace basic-design or detail-design.
- This skill does NOT auto-confirm assumptions.
- Small/clear tasks may Lite-skip design and hand off straight to planning or execution.

## References

- [Decision Matrix](https://asana.com/resources/decision-matrix)
- [How Might We Questions](https://www.designkit.org/methods/how-might-we)
