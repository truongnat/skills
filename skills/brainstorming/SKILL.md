---
name: brainstorming
description: Clarify goals, scope, constraints, options, trade-offs, risks, and recommendations before planning or implementation.
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
- Prepare handoff to planning, technical design, business analysis, or implementation.

The goal: help the team settle on the smallest, clearest, verifiable direction before investing larger effort.

## When to Use

Use this skill when:

- Starting a new task with unclear goals, scope, constraints, or solutions.
- User wants to discuss ideas before implementing.
- Multiple approaches exist and need trade-off analysis.
- Scope needs to be locked before planning.
- Need to define in-scope, out-of-scope, or non-goals.
- Need draft success criteria before moving to planning or business analysis.
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
- User needs detailed technical architecture; use technical-design if available.
- User needs deep external source research; use research.

## XML Contract

```xml
<Contract>
  <Inputs>Initial request, repo context, existing documents, constraints, current behavior, desired outcome, stakeholder feedback if available.</Inputs>
  <Outputs>Light discussion or full DISCUSSION.md with goal, facts, assumptions, unknowns, constraints, scope, options, trade-offs, recommendation, risks, open questions, handoff to planning.</Outputs>
  <Artifacts>
    <File name="DISCUSSION.md" required="true">
      <Schema>
        <field name="goal" type="string" required="true">One sentence describing the goal.</field>
        <field name="desired_outcome" type="string" required="true">What success looks like.</field>
        <field name="confirmed_facts" type="array" required="true">Known facts from user, repo, or research.</field>
        <field name="constraints" type="array" required="false">Time, platform, tech stack, budget, tool limits.</field>
        <field name="assumptions" type="array" required="false">Assumptions with risk level and confirmation status.</field>
        <field name="unknowns" type="array" required="false">Open questions with blocking flag.</field>
        <field name="scope_in" type="array" required="true">What is in scope.</field>
        <field name="scope_out" type="array" required="true">What is out of scope.</field>
        <field name="non_goals" type="array" required="false">Goals explicitly not pursued.</field>
        <field name="options_considered" type="table" required="true">Option, pros, cons, effort, risk, reversibility, verify method.</field>
        <field name="recommendation" type="string" required="true">Recommended option with reason and confidence.</field>
        <field name="risks" type="array" required="false">Risks with impact and mitigation.</field>
        <field name="handoff" type="string" required="true">Suggested next skill: planning/business-analysis/research/execution.</field>
      </Schema>
    </File>
  </Artifacts>
  <Safety>Do NOT implement code during brainstorming. Do NOT treat assumptions as facts. Do NOT create detailed planning before a clear recommendation. Do NOT create large extra artifacts unless requested.</Safety>
</Contract>
```

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
- This skill does NOT replace technical design.
- This skill does NOT auto-confirm assumptions.

## References

- [Decision Matrix](https://asana.com/resources/decision-matrix)
- [How Might We Questions](https://www.designkit.org/methods/how-might-we)
