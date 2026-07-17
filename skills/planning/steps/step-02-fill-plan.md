# Step 02 — Fill PLAN.md (strategy only)

## Goal

Fill `PLAN.md` as **strategy only**, including Spec quality review. Full task
cards stay in `TASKS.md` (step-03).

## Precondition (fail closed)

- [ ] Step ledger 01 = `done`
- [ ] `PLAN.md` contains headings `Step ledger` and `Spec quality review`
- [ ] No open Critical/blocking/unconfirmed html-recommended item from step-01

If precondition fails → return to step-01 / ask user.

## Rules

- Edit **only** `PLAN.md` in this step.
- Prefer inputs: `DETAIL_DESIGN.md` → screen/API design docs →
  `BASIC_DESIGN.md` → `BUSINESS_ANALYSIS.md` / `DISCUSSION.md`.
- **Forbidden in PLAN.md:** `### T-00x` bodies with Description / AC / Verify / Files / Status / Work items.
- Scope bullets must name **distinct deliverables** (agents will inventory-split these in step-03). Prefer “6 child screens (list ids)” over “FE UI”.
- Task index in this step may be a **draft** short list of phases; **step-03 will replace it** with the fine-grained ID list from Work inventory. Do not treat a 8–12 epic index as final quality.
- Do **not** put “write test cases / 6 dimensions matrix” as the first index item before feature work.
- Do **not** start step-03 until PLAN sections below are filled (no leftover `_(TODO)_` on required fields unless marked blocked).
- Re-check `Pre-planning decision gate` **and Spec quality review** before writing Goal/Scope/Approach.
  Any open Critical/blocking/Spec-quality issue means **stop and ask**, not “plan with an
  assumption.”
- Classify visual need as text/table/diagram/html-recommended/none. Planning
  does not create HTML: when HTML is confirmed, keep Ready=No and hand off to
  brainstorming/basic-design; resume after the decision is recorded.
- Update Step ledger 02 to `done` or `blocked` before leaving.

## Mandatory stop gate

Do not fill strategy or task index until all Critical/blocking rows **and**
blocking Spec quality findings are resolved with user answers/evidence. Use the
structured question tool when available; ask at most three focused blocking
questions at a time.

## Fill these PLAN.md sections

1. Pre-planning decision gate + clarification answers + visual triage
2. Spec quality review — Feasibility / Correctness / Capability recommendations
3. Goal (one sentence)
4. Scope / Non-goals — Scope: enumerate separable units (endpoints, services, screens, validations), not only layers
5. Assumptions (risk + confirmed)
6. Approach (phases only)
7. Affected areas (paths + confidence) — inspect repo when possible
8. Test strategy (optional — after-code)
9. Verification strategy
10. Definition of done
11. Rollback strategy
12. Risks
13. Task index (**draft** ID + title OK; refined in step-03)
14. Handoff (blockers; Ready stays No until step-04)
15. Context 5W1H when useful; use N/A/Unknown instead of filler.
16. Executive summary (maximum five bullets) — fill last, keep it first.

## Spec quality rules

- Do **not** plan as if specs/design are automatically correct.
- Re-validate Feasibility against current codebase/ops capacity.
- Re-validate Correctness against real APIs, DB, screens, and domain rules.
- List Capability recommendations omitted by specs/design (limits, validation,
  permissions, audit, errors, rollback, observability, UX edge cases). Promote
  Blocking=Yes gaps into the decision gate / clarification questions.
- Ready stays No while Feasibility/Correctness is Fail/Unknown+blocking or a
  Blocking=Yes capability gap remains open.

## Done when

- [ ] Required PLAN sections filled (or explicitly blocked with open questions).
- [ ] Spec quality review filled; blocking Fail/Unknown/gaps asked or deferred with evidence.
- [ ] No full task cards inside PLAN.md.
- [ ] Scope lists separable deliverables an inventory can explode in step-03.
- [ ] Decision gate has no unresolved Critical/blocking/visual decision.
- [ ] Step ledger 02 = `done` or `blocked`.

## Next

Only if Step ledger 02 = `done`: Read and follow `./step-03-fill-tasks.md`.
If `blocked`: stop for user answers.
Do **not** claim planning complete yet.
