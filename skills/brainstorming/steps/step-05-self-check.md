# Step 05 — Self-check and handoff

## Goal

Verify `DISCUSSION.md` against the brainstorming contract. Fail closed.

## Checks (run all)

1. Session folder listing shows `DISCUSSION.md`.
2. File was seeded from template (has Executive summary first, then expected
   headings: Goal, Facts, Scope, Options, Recommendation, Handoff).
3. Goal is one sentence — not a paragraph.
4. Facts / assumptions / unknowns are separated (no assumption labeled as fact).
5. Scope in and scope out both present.
6. Options matrix has ≥1 real option with verify method.
7. Recommendation has Choose + Reason + Confidence.
8. Handoff names one of: business-analysis, basic-design, planning, research, execution.
9. If Unknowns/Risks still block code merge, Handoff **Blockers** is not empty (must not claim “no blockers” while Unknowns list open decision/data/auth items).
10. No PLAN.md/TASKS.md/code changes invented by this skill (unless user explicitly asked outside contract).
11. Executive summary has at most five decision-oriented bullets; 5W1H uses
    N/A/Unknown rather than invented filler.
12. Issue triage covers material decisions; no Critical/blocking item was
    bypassed without a recorded user answer.
13. Visual triage distinguishes text/table/diagram/HTML. Any generated HTML is
    user-confirmed, self-contained, accessible, and linked to an Issue ID.

## Done when

- [ ] All checks pass **or** remaining issues sit under Unknowns + Handoff Blockers.
- [ ] User is told next skill and path to `DISCUSSION.md` (and that blockers still apply downstream).

## Stop

Brainstorming ends here. Do **not** auto-run planning/design unless user asks.
