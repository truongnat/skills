# Step 03 — Fill TASKS.md (micro-tasks)

## Goal

Fill `TASKS.md` with **executable micro-tasks** derived from a **Work inventory** of the design/docs — not a short list of layer epithets (“BE Search”, “FE form”).

Then align `PLAN.md` Task index IDs/titles with the final cards.

## Rules

- Edit **TASKS.md**; you **may** update **only** PLAN Task index (and execution-order mirroring) so IDs stay aligned.
- Prefer inputs in order: `DETAIL_DESIGN.md` → screen/API design docs → `BASIC_DESIGN.md` → `DISCUSSION.md`.
- **Order of work in this step:** (1) Work inventory → (2) cards → (3) sync PLAN Task index.
- **Execution order of tasks:** models/contracts → service/ops → API/entrypoints → UI/client → **then** automated tests.
- Do **not** make T-001 a test-case matrix before feature code.
- Lite Mode: inventory may be 1–3 rows; still no vague cards.

---

## A. Work inventory (mandatory — write into TASKS.md first)

Under `## Work inventory` in `TASKS.md`, build a table from design — **one row per implementable unit**:

| Inv | Unit (noun + verb) | Trace (doc § / AC / contract) | Layer |
|-----|--------------------|-------------------------------|-------|
| I-01 | … | … | model / service / api / ui / test |

### How to invent rows (do not invent design — invent **splits**)

Walk the design and emit a row for each of these when present:

| Design signal | Inventory row(s) |
|---------------|------------------|
| Request/response / DTO groups | One row per model group (e.g. SearchReq, SearchRes, ComboRes) — list **field names** in the unit text |
| Named API endpoint / method | **One row per endpoint** (method + path or operation id) |
| Query / JOIN / aggregation | Separate rows: compose query, map/group result, edge (over-max, empty) if specified |
| Export vs Print (or other ops) | **Separate rows** (different async/sync or artifact) |
| DI / route / config registration | Own row |
| Form field set | One row listing **control IDs / field keys** from design (not “the form”) |
| F-key / toolbar action | One row per distinct action (F3 export, F8 print, …) **or** one row that **names every key** in Work items later |
| Child screen / modal / dialog | **One row per screen** unless design says they share one shell + N configs (then: shell row + config rows) |
| Lookup / focusout | One row per handler **or** one row that names each handler ID |
| Validation rule group | Own row citing rule IDs/types from design |
| Automated test surface | Rows only **after** implement inventory for those surfaces |

**Count check (Full Mode):**  
`number of inventory rows` should be **≥ number of Scope bullets that name distinct deliverables** in PLAN/DISCUSSION.  
If Scope lists “6 child screens” and inventory has one “child screens” row → **FAIL** — split to 6 (or shell + 6).

Do **not** leave inventory empty or as a single “implement feature” row when design has detail.

---

## B. Task size (hard) — after inventory

Map roughly **1 inventory row → 1 task card** (merge only trivial twins).

A card **FAILS** size check if any of these is true:

1. Covers **≥3 inventory rows** that were listed separately.
2. Description names **≥3 deliverables** that could be separate commits (e.g. 4 endpoints + DI).
3. Title uses epic verbs: *build entire*, *implement whole*, *full page*, *all APIs*, *complete CRUD*, or vague layer titles only (`BE Search`, `FE UI`, `wire everything`).
4. Verify needs **≥4 independent** checkpoints.
5. Files/scope spans **multiple layers** (model + service + controller + UI) in one card.
6. Bundles **multiple child screens / multiple endpoints / Export+Print** in one card.

| FAIL | PASS |
|------|------|
| Implement all 4 endpoints + DI | Skeleton controller → one card per endpoint → DI card |
| BE Search query (JOIN + map + over-max) | Query compose → map/group → over-max handling |
| FE child screens (all 6) | One card per screen **or** shared shell + per-screen config cards |
| FE form + F-keys + validation | Form fields → F-keys → validation (+ messages) as separate cards |

Prefer **more smaller cards**. Large features often need **15–40+** cards — that is expected.

---

## C. Card specificity (hard) — reject vague prose

Before creating cards, re-check PLAN's decision gate. If an issue discovered
during inventory changes scope, contracts, data behavior, acceptance criteria,
or visual interaction and is Critical/blocking, add it to the gate, stop, and
ask the user. Never turn ambiguity into an implementation task.

Every kept `### T-00x` card **FAILS** unless **all** hold:

1. **Title:** names a concrete unit (endpoint name, type name, control IDs, screen id) — not only a layer.
2. **Trace:** cites design/doc **section or AC id** (e.g. `DETAIL_DESIGN §API Print`, `spec §10 JOIN`, `BR-03`) — not bare `spec` / `DISCUSSION`.
3. **Status:** `todo` at planning time (execution later moves it to `in_progress` / `done` / `blocked` / `skipped`).
4. **Work items:** **≥2** checkbox steps (`- [ ] 1. …`, `- [ ] 2. …`) with concrete symbols/fields/behaviors. No single sentence “Implement X per spec.” Leave boxes unchecked during planning.
5. **AC:** observable outcome (compile, status code, field present, file downloaded, message id) — not “works correctly” / “per spec”.
6. **Verify:** command, request example, or UI check tied to this card only.
7. **Files/scope:** concrete path(s) or “create `…/NamedFile.ext`”; confidence `known|inferred|unknown`. Not `backend` / `frontend` alone.
8. **No placeholders:** no `_(TODO)_`, `_(short title)_`, `_(…)_` left on kept cards.
9. **Progress board:** one row per card with matching ID/title, `Status: todo`, Done=`[ ]`.
10. **Flow/comment notes:** identify where implementation needs concise
    why/rationale comments for non-obvious flow, business rules, invariants, or
    security boundaries; otherwise write `N/A` with a reason.

### WRONG vs CORRECT (card body)

```markdown
// WRONG — generic
### T-003: BE Search query
- Description: Implement search query with joins per spec.
- AC: Search works.
- Files/scope: backend services
```

```markdown
// CORRECT — specific + split (one card shown)
### T-003: Compose BD08001 search JOIN (8 tables)
- Status: todo
- Trace: `BD08001_SCREEN_DESIGN_DETAIL` §10 Search query / JOIN list
- Work items:
  - [ ] 1. Add service method `SearchAsync` (or project pattern) on `…/FBD08001SearchService.cs`
  - [ ] 2. Join tables listed in §10 with operators (= / LIKE / range) mapped from Search request fields: OrderNo, SupplierCode, …
  - [ ] 3. Apply date-range + status filters from request; no grid persistence
- AC: Method returns rows shaped for §8 Search response mapping; empty input filters do not throw.
- Verify: Unit or manual call with sample request from §11; SQL/logic matches JOIN list in §10.
- Files/scope: `genka/backend/.../Services/.../FBD08001SearchService.cs` (confidence: inferred)
```

---

## D. Fill order

1. Write `## Work inventory` (complete table).
2. Fill `plan_ref`, Notes (point at blockers / inventory).
3. Create one `### T-00x` per mapped inventory row (template fields: Status=`todo`, checkbox **Work items**, Trace, AC, …).
4. Fill `## Progress board` with one row per card (Done=`[ ]`, Status=`todo`).
5. Set `## Execution order` to the full ID chain.
6. Update **PLAN.md Task index** to the same IDs + short titles (still no card bodies in PLAN).

## Done when

- [ ] Work inventory table is filled and passes the count/split checks in §A.
- [ ] Every Execution-order ID has a card; every card passes §B size + §C specificity.
- [ ] Progress board rows match card IDs/titles; all Status=`todo` and Done unchecked.
- [ ] PLAN Task index matches TASKS (no orphan IDs).
- [ ] No template placeholders remain on kept cards.
- [ ] Automated test tasks (if any) come after implement tasks for those surfaces.

## Next

Read and follow `./step-04-self-check.md`.
