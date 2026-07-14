# Step 03 — Fill TASKS.md (micro-tasks)

## Goal

Fill `TASKS.md` with **fine-grained micro-tasks** broken from design/docs. Match `PLAN.md` Task index.

## Rules

- Edit **TASKS.md** (and only adjust PLAN Task index if IDs must stay aligned).
- Each task = **one concern** (see size box below). Include `Trace:` to design/spec/BA.
- **Order:** models/contracts → service/ops → API/entrypoints → UI/client → **then** automated tests.
- Do **not** make T-001 (or first task) a test-case document / coverage matrix before code exists.
- Duplicate `### T-00x` template blocks as needed; delete unused placeholders.
- Lite Mode: still fill TASKS.md (1–3 specific cards).

## Task size (hard)

A card **FAILS** size check if any of these is true:

1. Description names **≥3 deliverables** that could be separate commits (e.g. 4 endpoints + DI registration).
2. Title uses epic verbs: *build entire*, *implement whole*, *full page*, *all APIs*, *complete CRUD*.
3. Verify step needs **≥4 independent** checkpoints to pass.
4. Files/scope spans **multiple layers** (model + service + controller + JS) in one card **without** a single narrow change set.
5. Description is longer than ~8 lines of work items.

**Split examples (from real failures):**

| FAIL (too big) | PASS (split) |
|----------------|--------------|
| Implement all 4 search endpoints + wire DI | T-a Create controller skeleton + route prefix; T-b Endpoint 1; T-c Endpoint 2; …; T-n Register DI |
| Write full ViewModel + View + JS binding | Separate cards: model fields → view markup → JS bind/search |
| Integrate other reports’ DI patterns + config | One card “locate DI pattern”, one “register this feature”, one “config/env if needed” |

Prefer **more smaller cards** over fewer large ones. Agent execution succeeds on small cards.

## Fill

1. `plan_ref: PLAN.md`
2. Execution order (same IDs as PLAN Task index)
3. Notes (optional)
4. Full cards: Status, Trace, Depends, Description, AC, Verify, Files/scope + confidence

## Done when

- [ ] Every Task index ID has a `### T-00x` card in TASKS.md.
- [ ] Every kept card passes Task size (hard).
- [ ] Cards have Trace + AC + Verify.
- [ ] Automated test tasks (if any) come after implement tasks for those surfaces.
- [ ] No leftover empty placeholder titles like `_(short title)_` on kept cards.

## Next

Read and follow `./step-04-self-check.md`.
