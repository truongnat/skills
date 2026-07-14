# Step 04 — Self-check and handoff

## Goal

Verify artifacts against the planning contract. Fail closed — do not set Ready=Yes if checks fail or blockers remain.

## Checks (run all)

### Structure

1. Session folder listing shows both `PLAN.md` and `TASKS.md`.
2. `PLAN.md` has **no** `### T-00x` sections with AC/Verify/Files/Status bodies.
3. `TASKS.md` has `plan_ref` and at least one real `### T-00x` card (not only empty template titles).
4. Every ID in PLAN Task index appears in TASKS.md Execution order and as a heading.

### Quality

5. First implement-oriented task is **not** “write test cases / TC matrix / 6 dimensions” before feature code.
6. Every TASKS card passes **Task size** from `step-03-fill-tasks.md` (no epic / multi-layer dump).
7. Confirmed assumptions in PLAN: any **High-impact** row still `Confirmed?: No` counts as a **blocker**.

### Blockers → Ready (critical)

8. Re-read `DISCUSSION.md` Handoff blockers (if present). Copy any **still unresolved** items into PLAN Handoff blockers.
9. **Ready for sync/execution? must be No** if any of:
   - Checks 1–7 fail
   - PLAN Handoff blockers list is non-empty (unresolved)
   - DISCUSSION listed blockers that were never resolved/struck
10. **Ready = Yes** only when checks 1–7 pass **and** Handoff blockers are `none` (or explicitly marked resolved with evidence).

Never write Ready=Yes while the same document’s Blockers line still lists open items.

## Done when

- [ ] PLAN Handoff Ready matches rules 8–10.
- [ ] Failures are listed in Blockers or fixed by returning to step-02/step-03.
- [ ] User is told:
  - If Ready=Yes → next skill `sync` (old `SYNC.md` is stale; must re-run sync).
  - If Ready=No → do **not** execute; resolve blockers or ask user; may re-run planning after clarifications.

## Stop

Do **not** invent an extra step. Do **not** implement code here.
Planning skill ends when this step completes.
