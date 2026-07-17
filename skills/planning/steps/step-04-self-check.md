# Step 04 — Self-check and handoff

## Goal

Verify artifacts against the planning contract. Fail closed — do not set Ready=Yes if checks fail or blockers remain.

## Checks (run all)

### Structure

1. Session folder listing shows both `PLAN.md` and `TASKS.md`.
2. `PLAN.md` has **no** `### T-00x` sections with AC/Verify/Files/Status/Work-items bodies.
3. `TASKS.md` has `plan_ref`, a filled `## Work inventory` table (Full Mode), a `## Progress board`, and at least one real `### T-00x` card.
4. Every ID in PLAN Task index appears in TASKS.md Execution order, Progress board, and as a heading; counts match. Progress board Status=`todo` and Done=`[ ]` at planning handoff.
5. No template leftovers on kept content: `_(TODO)_`, `_(short title)_`, `_(…)_`, `T-002 → _(extend)_` left as the only order, empty inventory row only.

### Quality — size & specificity

6. First implement-oriented task is **not** “write test cases / TC matrix / 6 dimensions” before feature code.
7. Every TASKS card passes **Task size** and **Card specificity** from `step-03-fill-tasks.md` (§B and §C).
8. Spot-check fail patterns (any one → FAIL, return to step-03):
   - Titles that are only layer epithets: `BE Search`, `FE form`, `API`, `UI`, `tests` with no named unit
   - Description / Work items missing numbered checkbox steps (`- [ ] N. …`) or only “Implement X per spec”
   - One card owns multiple endpoints **or** multiple child screens **or** Export+Print together
   - Trace has no section/AC id
   - Files/scope is only `backend` / `frontend` / `services`
   - AC is only “works” / “correct” / “per spec”
9. Full Mode inventory: row count is credible vs Scope (e.g. “6 child screens” ⇒ ≥6 related inventory rows or shell+N — not one row).
10. Confirmed assumptions in PLAN: any **High-impact** row still `Confirmed?: No` counts as a **blocker**.

### Blockers → Ready (critical)

11. Re-read `DISCUSSION.md` Handoff blockers (if present). Copy any **still unresolved** items into PLAN Handoff blockers.
12. **Ready for sync/execution? must be No** if any of:
    - Checks 1–10 fail
    - PLAN Handoff blockers list is non-empty (unresolved)
    - DISCUSSION listed blockers that were never resolved/struck
13. **Ready = Yes** only when checks 1–10 pass **and** Handoff blockers are `none` (or explicitly marked resolved with evidence).

Never write Ready=Yes while the same document’s Blockers line still lists open items.

## Done when

- [ ] PLAN Handoff Ready matches rules 11–13.
- [ ] Failures are listed in Blockers or fixed by returning to step-02/step-03.
- [ ] User is told:
  - If Ready=Yes → next skill `sync` (old `SYNC.md` is stale; must re-run sync).
  - If Ready=No → do **not** execute; resolve blockers or ask user; may re-run planning after clarifications.
  - If tasks were too coarse → explicitly say: rewrite via step-03 using Work inventory (do not execute on epic cards).

## Stop

Do **not** invent an extra step. Do **not** implement code here.
Planning skill ends when this step completes.
