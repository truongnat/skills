# Step 02 — Fill PLAN.md (strategy only)

## Goal

Fill `PLAN.md` as **strategy only**. Full task cards stay in `TASKS.md` (step-03).

## Rules

- Edit **only** `PLAN.md` in this step.
- Prefer inputs: `DETAIL_DESIGN.md` → screen/API design docs → `BASIC_DESIGN.md` → `DISCUSSION.md` / BA notes.
- **Forbidden in PLAN.md:** `### T-00x` bodies with Description / AC / Verify / Files / Status / Work items.
- Scope bullets must name **distinct deliverables** (agents will inventory-split these in step-03). Prefer “6 child screens (list ids)” over “FE UI”.
- Task index in this step may be a **draft** short list of phases; **step-03 will replace it** with the fine-grained ID list from Work inventory. Do not treat a 8–12 epic index as final quality.
- Do **not** put “write test cases / 6 dimensions matrix” as the first index item before feature work.
- Do **not** start step-03 until PLAN sections below are filled (no leftover `_(TODO)_` on required fields unless marked blocked).

## Fill these PLAN.md sections

1. Goal (one sentence)
2. Scope / Non-goals — Scope: enumerate separable units (endpoints, services, screens, validations), not only layers
3. Assumptions (risk + confirmed)
4. Approach (phases only)
5. Affected areas (paths + confidence) — inspect repo when possible
6. Test strategy (optional — after-code)
7. Verification strategy
8. Definition of done
9. Rollback strategy
10. Risks
11. Task index (**draft** ID + title OK; refined in step-03)
12. Handoff (blockers; Ready stays No until step-04)
13. Context 5W1H when useful; use N/A/Unknown instead of filler.
14. Executive summary (maximum five bullets) — fill last, keep it first.

## Done when

- [ ] Required PLAN sections filled (or explicitly blocked with open questions).
- [ ] No full task cards inside PLAN.md.
- [ ] Scope lists separable deliverables an inventory can explode in step-03.

## Next

Read and follow `./step-03-fill-tasks.md`.
Do **not** claim planning complete yet.
