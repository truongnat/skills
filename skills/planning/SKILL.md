---
name: planning
description: "Build PLAN.md (strategy, DoD, rollback) and TASKS.md (detailed executable tasks) from DETAIL_DESIGN.md (preferred), design/discussion artifacts, or clear requests. (Hard contract in this SKILL.md — MUST follow.)"
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

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | DETAIL_DESIGN.md when present; else BASIC_DESIGN.md / DISCUSSION.md / requirement notes; user request; codebase mapping; affected systems; constraints. |
| Outputs | PLAN.md with goal, scope, approach, verification strategy, DoD, rollback, task_index; TASKS.md with detailed task cards, dependencies, AC, verification, execution_order. |
| Safety | Do NOT implement code during planning. Do NOT dump full task cards into PLAN.md — those belong in TASKS.md. Do NOT invent affected files without inspecting the codebase. Do NOT treat assumptions as confirmed. Do NOT skip rollback for destructive changes. Do NOT re-design architecture when design artifacts already exist. |

### Required artifacts

#### `PLAN.md`
- Required: yes
- **goal** (required, string): One sentence.
- **scope** (required, string): In scope summary.
- **non_goals** (optional, array): Explicitly excluded outcomes.
- **assumptions** (required, array): Assumptions with risk and confirmation status.
- **approach** (required, string): Phased strategy (how work will proceed). Not step-by-step file edits.
- **affected_areas** (optional, array): Systems/dirs to touch with confidence (known / inferred / unknown). High level only.
- **test_strategy** (optional, string): Optional coverage summary (dimensions, frameworks in project, estimated depth).
- **verification_strategy** (required, string): Automated and manual verification approach for the whole change.
- **definition_of_done** (required, array): Checklist of verifiable completion conditions.
- **rollback_strategy** (required, string): How to undo changes per type (code/config/data).
- **risks** (optional, array): Risks with impact and mitigation.
- **task_index** (required, array): Ordered task IDs summarizing TASKS.md (e.g. T-001 Write tests, T-002 Implement API).
- **handoff** (required, string): Ready for sync/execution? Blocking items? Review required?

#### `TASKS.md`
- Required: yes
- **plan_ref** (required, string): Reference to PLAN.md.
- **tasks** (required, array): Task cards: ID, title, description, dependencies, acceptance_criteria, verification, files_or_scope, confidence, status (todo/in_progress/done).
- **execution_order** (required, array): Ordered list of task IDs.
- **notes** (optional, array): Sequencing notes, blockers, or split-file references.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

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
