# Step 02 — Frame (goal, facts, constraints)

## Goal

Fill framing and issue/visual triage. Stop for user clarification before
scope/options when a Critical issue or blocking unknown remains.

## Rules

- Edit **only** `DISCUSSION.md`.
- Separate **facts** vs **assumptions** vs **unknowns** — never mix.
- Goal = **one sentence**.
- Inspect repo/user input for facts; mark guesses as assumptions.
- Do **not** implement code.
- Do **not** write PLAN/TASKS or basic/detail design.
- Classify every material issue by severity, clarity, blocking status, owner,
  and visual need.
- Use the structured question tool when available. Ask at most three focused
  blocking questions at a time; explain why each answer changes the direction.

## Fill these sections

1. Goal
2. Desired outcome
3. Confirmed facts
4. Constraints
5. Assumptions (risk + confirmed)
6. Unknowns (blocking flag)
7. Issue triage
8. Clarification checkpoint
9. Visual triage

## Mandatory stop gate

Stop and wait for the user when any item is:

- severity `Critical` and not explicitly accepted/resolved; or
- clarity `Partial/Unknown` and marked `Blocking: Yes`; or
- `html-recommended` and the user has not confirmed whether to create the
  visual decision aid.

Do not continue to step-03, choose defaults, or hide these items as assumptions.
Record each question and answer in `Clarification checkpoint`.

## Done when

- [ ] Goal is one clear sentence.
- [ ] At least one confirmed fact **or** explicit “no facts yet” with unknowns listed.
- [ ] Assumptions and unknowns are not labeled as facts.
- [ ] Every material issue has severity/clarity/blocking/visual classification.
- [ ] No unresolved Critical or blocking item remains before moving on.
- [ ] No leftover `_(TODO)_` on Goal / Desired outcome (unless blocked — then note blocker).

## Next

Read and follow `./step-03-scope-options.md`.
