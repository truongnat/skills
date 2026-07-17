---
name: brainstorming
description: >-
  Step workflow: seed DISCUSSION.md template then fill frame → scope/options →
  recommendation → self-check. Clarify direction before design/planning.
  (Hard contract in this SKILL.md — MUST follow.)
---

# Brainstorming

## Language (do this first)

**Re-read `.agents/settings.yaml` now** — do not reuse a `language` value cached
earlier in this session. Write every saved artifact and reply in that `language`
(`en` or `vi`); keep code, identifiers, paths, commands, and template section
keys unchanged. If the user just edited settings, the freshly read value wins. A
direct instruction in the current user request overrides the file.

## Purpose

Turn an initial request into a clear direction via a **forced step sequence**:

1. Seed `DISCUSSION.md` from template  
2. Frame goal / facts / assumptions / unknowns; **Spec quality review**; triage issues; **stop and ask**
   on unresolved critical/blocking/Spec-quality items
3. Scope + options matrix (only after Spec quality gate passes)
4. Finalize Spec quality; recommendation + handoff
5. Self-check  

Do not invent PLAN/TASKS or implement code here.

## Workflow architecture (mandatory)

- Read **one** step fully; finish it before the next.
- Keep the **Step ledger** in `DISCUSSION.md` updated every step.
- **NEVER** skip step-01 (template seed).
- **NEVER** jump to recommendation before frame + Spec quality + scope/options.
- **NEVER** skip Spec quality review (Feasibility / Correctness / Capability).
- **NEVER** continue past step-02 while a Critical issue, blocking unknown, or
  blocking Spec quality finding is unresolved. Ask focused questions and wait
  for the user.
- **NEVER** claim complete until step-05 passes (or blockers documented).
- Each step has a **Precondition**. If it fails, return to the previous step —
  do not “catch up” by filling later sections first.

| Path | Role |
|------|------|
| [templates/DISCUSSION.template.md](./templates/DISCUSSION.template.md) | Seed for session `DISCUSSION.md` |
| [templates/VISUAL_DECISION.template.html](./templates/VISUAL_DECISION.template.html) | Optional visual decision aid (CDN + dual load) |
| [steps/step-01-init.md](./steps/step-01-init.md) | Copy template into session |
| [steps/step-02-frame.md](./steps/step-02-frame.md) | Goal, facts, Spec quality review, triage |
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
| Outputs | Session `DISCUSSION.md` seeded from template, with issue/visual triage and clarification decisions; session `OVERVIEW.md`; optional `VISUAL_DECISION.html`. |
| Safety | Do NOT implement code. Do NOT skip steps. Stop and ask before continuing when Critical issues, blocking unknowns, or blocking Spec quality findings are unresolved. Do NOT treat specs/assumptions as automatically correct or feasible. Do NOT create PLAN/TASKS or detailed design before a clear recommendation. Do NOT hide blocking unknowns or omitted feature capabilities. HTML must include Tailwind + anime.js CDN tags for static viewing, stay accessible, avoid sensitive data, and be created only after user confirmation (unless explicitly requested). Choice logging still requires session-serve. |

### Required artifact

#### `DISCUSSION.md` (from template)
executive_summary, developer_overview, charts (Mermaid when useful),
goal, desired_outcome,
confirmed_facts, constraints, assumptions, unknowns, issue_triage,
clarification_checkpoint, spec_quality_review (feasibility, correctness,
capability_recommendations), visual_triage, scope_in, scope_out, non_goals,
options_considered, recommendation, risks, handoff.

#### `OVERVIEW.md`
- Required: yes after session seed.
- Developer landing page: status, progress chart, open decisions, next action.

#### `VISUAL_DECISION.html`
- Required: no.
- Use only for issues classified `html-recommended` and confirmed by the user.
- Show the decision question, alternatives/states, differences, risks, and the
  decision requested. It is a decision aid, not production UI.
- Must include Tailwind CDN + anime.js CDN tags so static open still renders;
  include relative + absolute local theme links per `.agents/DESIGN_SYSTEM.md`.
- Viewing works statically; recording a choice needs
  `python .agents/tools/session-serve/serve.py <session>`.
- Read the result with `python .agents/tools/choice-reader/read.py <session> --issue-id <issue-id>` and write it into Clarification checkpoint.

### Reference

`agents/openai.yaml` mirrors contract for tooling. **Steps + template are authoritative for execution order.**

## Forbidden outputs (reject / rewrite)

| Failure | Fix |
|---------|-----|
| No template seed | Restart step-01 |
| Chat-only brainstorm | Write `DISCUSSION.md` |
| Step ledger skipped / later step `done` while earlier `todo`/`blocked` | Fix ledger; return to earliest incomplete step |
| Assumptions labeled as facts | Move to Assumptions / Unknowns |
| Continued with unresolved Critical/blocking issue | Stop, ask focused questions, wait for answers |
| Specs accepted without feasibility/correctness/capability review | Fill Spec quality review; ask blocking gaps |
| Scope/options filled before Spec quality done | Return to step-02; clear premature scope if needed |
| Generated HTML for every issue | Triage first; use table/diagram/text when sufficient |
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
- [ ] Issues classified by severity, clarity, blocking status, and visual need.
- [ ] Spec quality review covers Feasibility, Correctness, and Capability recommendations.
- [ ] No unresolved Critical/blocking issue or blocking Spec quality finding was bypassed; questions and answers are recorded.
- [ ] HTML is used only when spatial/state comparison materially improves the decision.
- [ ] Scope in and out separated.
- [ ] Options matrix used; recommendation has reason + confidence.
- [ ] Handoff names one next skill.
- [ ] `DISCUSSION.md` on disk; step-05 passed.

## Limitations

- Does NOT implement code or replace planning/design/BA.
- Does NOT auto-confirm assumptions.
- Small/clear tasks may Lite-skip later design in **handoff text**, still produce DISCUSSION.md via steps.

## Visual triage rubric

| Need | Use |
|---|---|
| Simple factual question or one-dimensional choice | Text / Markdown table |
| Architecture, sequence, state, or data flow | Mermaid/diagram |
| UI layout, responsive behavior, before/after, multiple visual states, or spatial option comparison | `html-recommended` |
| No decision benefit from a visual | `none` |

Do not confuse “complex” with “needs HTML.” HTML is justified only when a
visual/spatial representation reduces decision ambiguity.
