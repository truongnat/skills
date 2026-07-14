---
name: planning
description: Build PLAN.md (strategy, DoD, rollback) and TASKS.md (detailed executable tasks) from DETAIL_DESIGN.md (preferred), design/discussion artifacts, or clear requests.
---

# Planning

## Purpose

Turn a clear goal into:

1. **PLAN.md** — strategy: scope, approach, verification, DoD, rollback, risks.
2. **TASKS.md** — executable work: detailed task cards with AC, verification, files, dependencies.

Prefer `DETAIL_DESIGN.md` as input when present (then `BASIC_DESIGN.md`, then `DISCUSSION.md`). Do not re-design architecture or invent contracts — use the design artifacts.

Do **not** put full task cards in PLAN.md. PLAN may only list a `task_index` (ordered IDs + short titles) pointing at TASKS.md.

## Dynamic depth

- Lite Mode: thin PLAN + short TASKS (1–3 cards).
- Full Mode: both artifacts with complete schemas.
- Omit unused optional PLAN sections; keep TASKS cards independently verifiable.

## XML Contract

See [openai.yaml](./agents/openai.yaml)

## Quality Standards

### PLAN.md

- [ ] Goal is one sentence; scope and assumptions are clear.
- [ ] Approach is phased strategy — not a dump of file-level steps.
- [ ] Verification strategy and DoD are falsifiable.
- [ ] Rollback matches change scope (code/config/data as needed).
- [ ] `task_index` lists every TASKS.md ID in order (summary only).
- [ ] No full AC/verify/file lists inside PLAN task sections.

### TASKS.md

- [ ] Each task has an ID (T-001, T-002) and is independently verifiable.
- [ ] Each task has at least one acceptance criterion and a verification method.
- [ ] Dependencies and `execution_order` are consistent.
- [ ] `files_or_scope` uses confidence known / inferred / unknown — do not invent paths.
- [ ] Status starts as `todo` unless already agreed otherwise.

### Test-first guidance (when feature work needs tests)

- Prefer an early task (often T-001) to author test cases using the **project's real frameworks**.
- Optional PLAN `test_strategy` may summarize coverage dimensions (UI/API/service/data/contract/security) without domain-locked formulas.
- Scan the repo for existing test tooling; do not invent a framework.

## WRONG vs CORRECT

```markdown
 // WRONG — all task detail stuffed into PLAN.md
## Tasks
T-002: Edit FooService.cs line 40… AC: … Verify: …

// CORRECT — PLAN stays strategic
## Approach
1. Lock contracts from DETAIL_DESIGN
2. Implement service + API
3. Verify with project test suite
## Task index
T-001 Write tests → T-002 Implement API → T-003 Wire client
(See TASKS.md)
```

```markdown
// WRONG — vague TASKS card
T-002: Update the export feature.

// CORRECT — verifiable TASKS card
T-002: Add server-side permission check for export endpoint.
Depends: T-001
AC: Unauthorized token on POST /api/export returns 403.
Verify: curl with unauthorized token → expect 403.
Files: inferred `.../ExportController` (confirm in sync).
Status: todo
```

```markdown
// WRONG — no rollback in PLAN
Rollback: Not needed.

// CORRECT
Rollback (code): revert commit or disable feature flag.
Rollback (data): down-migration + restore from pre-change backup.
```

## Edge Cases

| Situation | Handling |
|---|---|
| Affected files unknown | Mark confidence unknown in TASKS; add an investigate task if needed. |
| Assumptions block execution | Mark blocking in PLAN assumptions; require confirmation before execution. |
| Task has no verification command | Note "command unknown" in TASKS; resolve during sync. |
| Single-file change | Lite Mode — short PLAN + 1–3 TASKS cards. |
| Large work | Keep one PLAN; split TASKS into sections or linked TASKS-*.md notes if needed. |
| Destructive change | Require user review of PLAN rollback before execution. |

## Limitations

- Does NOT implement code.
- Does NOT replace brainstorming when direction is unclear.
- Does NOT replace basic-design or detail-design when architecture or contracts are missing for a non-Lite task.
- Does NOT re-design architecture when design artifacts already exist.
- Does NOT replace investigate when codebase mapping is missing.
- Does NOT auto-confirm assumptions.
