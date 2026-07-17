# Step 02 — Fill PLAN.md (strategy only)

## Goal

Fill `PLAN.md` as **strategy only**. Full task cards stay in `TASKS.md` (step-03).

## Rules

- Edit **only** `PLAN.md` in this step.
- Prefer inputs: `DETAIL_DESIGN.md` → screen/API design docs →
  `BASIC_DESIGN.md` → `BUSINESS_ANALYSIS.md` / `DISCUSSION.md`.
- **Forbidden in PLAN.md:** `### T-00x` bodies with Description / AC / Verify / Files / Status / Work items.
- Scope bullets must name **distinct deliverables** (agents will inventory-split these in step-03). Prefer “6 child screens (list ids)” over “FE UI”.
- Task index in this step may be a **draft** short list of phases; **step-03 will replace it** with the fine-grained ID list from Work inventory. Do not treat a 8–12 epic index as final quality.
- Do **not** put “write test cases / 6 dimensions matrix” as the first index item before feature work.
- Do **not** start step-03 until PLAN sections below are filled (no leftover `_(TODO)_` on required fields unless marked blocked).
- Re-check `Pre-planning decision gate` before writing Goal/Scope/Approach.
  Any open Critical/blocking issue means **stop and ask**, not “plan with an
  assumption.”
- Classify visual need as text/table/diagram/html-recommended/none. Planning
  does not create HTML: when HTML is confirmed, keep Ready=No and hand off to
  brainstorming/basic-design; resume after the decision is recorded.

## Mandatory stop gate

Do not fill strategy or task index until all Critical/blocking rows are
resolved with user answers/evidence. Use the structured question tool when
available; ask at most three focused blocking questions at a time.

## Fill these PLAN.md sections

1. Pre-planning decision gate + clarification answers + visual triage
2. Goal (one sentence)
3. Scope / Non-goals — Scope: enumerate separable units (endpoints, services, screens, validations), not only layers
4. Assumptions (risk + confirmed)
5. Approach (phases only)
6. Affected areas (paths + confidence) — inspect repo when possible
7. Test strategy (optional — after-code)
8. Verification strategy
9. Definition of done
10. Rollback strategy
11. Risks
12. Task index (**draft** ID + title OK; refined in step-03)
13. Handoff (blockers; Ready stays No until step-04)
14. Context 5W1H when useful; use N/A/Unknown instead of filler.
15. Executive summary (maximum five bullets) — fill last, keep it first.

## Done when

- [ ] Required PLAN sections filled (or explicitly blocked with open questions).
- [ ] No full task cards inside PLAN.md.
- [ ] Scope lists separable deliverables an inventory can explode in step-03.
- [ ] Decision gate has no unresolved Critical/blocking/visual decision.

## Next

Read and follow `./step-03-fill-tasks.md`.
Do **not** claim planning complete yet.
