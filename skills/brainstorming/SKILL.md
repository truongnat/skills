---
name: brainstorming
description: >-
  Step workflow: seed DISCUSSION.md template then fill frame → scope/options →
  recommendation → self-check. Clarify direction before design/planning.
  (Hard contract in this SKILL.md — MUST follow.)
---

# Brainstorming

## Purpose

Turn an initial request into a clear direction via a **forced step sequence**:

1. Seed `DISCUSSION.md` from template  
2. Frame goal / facts / assumptions / unknowns  
3. Scope + options matrix  
4. Recommendation + handoff  
5. Self-check  

Do not invent PLAN/TASKS or implement code here.

## Workflow architecture (mandatory)

- Read **one** step fully; finish it before the next.
- **NEVER** skip step-01 (template seed).
- **NEVER** jump to recommendation before frame + scope/options.
- **NEVER** claim complete until step-05 passes (or blockers documented).

| Path | Role |
|------|------|
| [templates/DISCUSSION.template.md](./templates/DISCUSSION.template.md) | Seed for session `DISCUSSION.md` |
| [steps/step-01-init.md](./steps/step-01-init.md) | Copy template into session |
| [steps/step-02-frame.md](./steps/step-02-frame.md) | Goal, facts, constraints, assumptions, unknowns |
| [steps/step-03-scope-options.md](./steps/step-03-scope-options.md) | Scope + options matrix |
| [steps/step-04-recommend.md](./steps/step-04-recommend.md) | Recommendation, risks, handoff |
| [steps/step-05-self-check.md](./steps/step-05-self-check.md) | Verify + stop |

### Execution entry

**Start here:** Read and follow [steps/step-01-init.md](./steps/step-01-init.md) immediately after this Contract.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action.

| Field | Requirement |
|-------|-------------|
| Inputs | Initial request, repo context, existing documents, constraints, current behavior, desired outcome, stakeholder feedback if available. |
| Outputs | Session `DISCUSSION.md` seeded from template then filled via steps. Incomplete if chat-only or free-form file without template sections. |
| Safety | Do NOT implement code. Do NOT skip steps. Do NOT treat assumptions as facts. Do NOT create PLAN/TASKS or detailed design before a clear recommendation. Do NOT hide blocking unknowns (must appear under Handoff blockers). Do NOT create large extra artifacts unless requested. |

### Required artifact

#### `DISCUSSION.md` (from template)
executive_summary, context_5w1h (when useful), goal, desired_outcome,
confirmed_facts, constraints, assumptions, unknowns, scope_in, scope_out,
non_goals, options_considered, recommendation, risks, handoff.

### Reference

`agents/openai.yaml` mirrors contract for tooling. **Steps + template are authoritative for execution order.**

## Forbidden outputs (reject / rewrite)

| Failure | Fix |
|---------|-----|
| No template seed | Restart step-01 |
| Chat-only brainstorm | Write `DISCUSSION.md` |
| Assumptions labeled as facts | Move to Assumptions / Unknowns |
| No recommendation or no handoff skill | Complete step-04 |
| “No blockers” while blocking Unknowns remain | List them under Handoff Blockers |
| Jumped to planning/design in this skill | Stop; handoff only |

## When to Use / NOT

**Use when:** unclear goals/scope, multiple approaches, need DISCUSSION.md before design/planning.

**Do NOT use when:** tiny clear fix, already have DISCUSSION and user wants execution, pure debug/review, needs BA/design/research as the primary skill.

## Lite Mode

Still run **all five steps**. Keep sections short; options may be 1–2 rows.

## Quality Standards

- [ ] Goal is one sentence.
- [ ] Facts / assumptions / unknowns separated.
- [ ] Scope in and out separated.
- [ ] Options matrix used; recommendation has reason + confidence.
- [ ] Handoff names one next skill.
- [ ] `DISCUSSION.md` on disk; step-05 passed.

## Limitations

- Does NOT implement code or replace planning/design/BA.
- Does NOT auto-confirm assumptions.
- Small/clear tasks may Lite-skip later design in **handoff text**, still produce DISCUSSION.md via steps.
