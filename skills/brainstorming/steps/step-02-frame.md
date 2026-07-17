# Step 02 — Frame (goal, facts, Spec quality)

## Goal

Fill framing, **Spec quality review**, and issue/visual triage. Stop for user
clarification before scope/options when a Critical issue, blocking unknown, or
blocking Spec quality finding remains.

## Precondition (fail closed)

- [ ] Step ledger 01 = `done`
- [ ] `DISCUSSION.md` exists and contains headings `Step ledger` and `Spec quality review`

If precondition fails → return to step-01. Do **not** continue.

## Rules

- Edit **only** `DISCUSSION.md`.
- Separate **facts** vs **assumptions** vs **unknowns** — never mix.
- Goal = **one sentence**.
- Inspect repo/user input for facts; mark guesses as assumptions.
- Do **not** implement code.
- Do **not** write PLAN/TASKS or basic/detail design.
- Do **not** fill Scope/Options/Recommendation in this step.
- Classify every material issue by severity, clarity, blocking status, owner,
  and visual need.
- Use the structured question tool when available. Ask at most three focused
  blocking questions at a time; explain why each answer changes the direction.
- Update Step ledger 02 to `done` or `blocked` before leaving this step.

## Fill these sections

1. Goal
2. Desired outcome
3. Confirmed facts
4. Constraints
5. Assumptions (risk + confirmed)
6. Unknowns (blocking flag)
7. Issue triage
8. Clarification checkpoint
9. Spec quality review — Feasibility / Correctness / Capability recommendations
10. Visual triage

## Spec quality rules

- Do **not** accept specs at face value. Challenge them against the repo and domain.
- **Feasibility:** can this actually be delivered with current stack/data/auth/ops/time?
- **Correctness:** are specs consistent with the real system (or is the system wrong)?
- **Capability recommendations:** list what a feature of this type should normally
  include even if specs omit it (limits, validation, permissions, audit, errors,
  rollback, observability, UX edge cases). Promote each material gap to Issue
  triage / Clarification checkpoint.
- Verdicts: `Pass` / `Pass-with-gaps` / `Fail` / `Unknown`.

## Mandatory stop gate

Stop and wait for the user when any item is:

- severity `Critical` and not explicitly accepted/resolved; or
- clarity `Partial/Unknown` and marked `Blocking: Yes`; or
- Spec quality Feasibility/Correctness is `Fail` or `Unknown` with Blocking=Yes; or
- a Blocking=Yes capability gap is unanswered; or
- `html-recommended` and the user has not confirmed whether to create the
  visual decision aid.

Do not continue to step-03, choose defaults, or hide these items as assumptions.
Record each question and answer in `Clarification checkpoint`.

## Done when

- [ ] Goal is one clear sentence.
- [ ] At least one confirmed fact **or** explicit “no facts yet” with unknowns listed.
- [ ] Assumptions and unknowns are not labeled as facts.
- [ ] Every material issue has severity/clarity/blocking/visual classification.
- [ ] Spec quality review has Feasibility + Correctness verdicts and ≥1 capability
      gap row (or explicit “no material gaps”).
- [ ] No unresolved Critical or blocking item remains before moving on.
- [ ] Step ledger 02 = `done` or `blocked` (with questions asked).
- [ ] No leftover `_(TODO)_` on Goal / Desired outcome / Spec quality verdicts
      (unless blocked — then note blocker).

## Next

Only if Step ledger 02 = `done`: Read and follow `./step-03-scope-options.md`.
If `blocked`: stop for user answers — do **not** scope around open Spec quality blockers.
