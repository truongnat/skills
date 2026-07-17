---
name: execution
description: "Execute TASKS.md guided by PLAN.md: modify files, mark task/step progress in TASKS.md, run verification, record EXECUTION.md, handle failures, and handoff to review. (Hard contract in this SKILL.md — MUST follow.)"
---

# Execution

## Language (do this first)

**Re-read `.agents/settings.yaml` now** — do not reuse a `language` value cached
earlier in this session. Write every saved artifact and reply in that `language`
(`en` or `vi`); keep code, identifiers, paths, commands, and template section
keys unchanged. If the user just edited settings, the freshly read value wins. A
direct instruction in the current user request overrides the file.

## Purpose

Execute locked work from TASKS.md (fine-grained micro-tasks + order), guided by PLAN.md strategy/DoD/rollback, in a controlled and verifiable way. Follow `execution_order`: implement feature tasks before automated test tasks for the same surface.

**Progress is mandatory:** as each Work item finishes and each card is verified, update `TASKS.md` (checkboxes + Status + Progress board) so anyone can see what is done.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | TASKS.md (task cards + Progress board + execution_order), PLAN.md (strategy/DoD/rollback), `.agents/PRJ_REFERENCE.md`, project settings, locked scope, affected files, constraints, verification commands. |
| Outputs | Workspace changes within scope; **updated TASKS.md progress** (Status, Done column, Work item checkboxes, progress chart); EXECUTION.md; refreshed `OVERVIEW.md`. |
| Safety | Do NOT modify outside scope. Execute by task ID from TASKS.md; use PLAN.md for DoD/rollback only. Do NOT put secrets in files/logs. Do NOT delete sensitive files/config/migration/data without a plan or confirmation. Do NOT revert changes not belonging to you without permission. Do NOT claim completion without verification or documenting skipped checks. Do NOT leave TASKS.md progress stale after finishing a Work item or card (must check off / set Status). |

### Required artifacts

#### `TASKS.md` (progress updates — required)
- Required: yes (update in place; do not rewrite the plan)
- While executing, keep these in sync:
  - Card **Status:** `todo` → `in_progress` when started → `done` when AC+Verify pass → `blocked` / `skipped` with reason if stopped.
  - Card **Work items:** flip `- [ ]` → `- [x]` as each step completes (do not wait until the whole card is done).
  - **Progress board:** same Status as the card; Done=`[x]` only when Status=`done`.
  - **Progress chart:** keep the Mermaid pie/status chart aligned with the board.
- Status values: `todo` | `in_progress` | `done` | `blocked` | `skipped` (see TASKS Status legend).

#### `EXECUTION.md`
- Required: yes
- **executive_summary** (required, array): Maximum five bullets with outcome, progress, verification, blocker/risk, and next action.
- **developer_overview** (required, object): Status, current task, done/total, blockers, next action.
- **charts** (optional, array): Mermaid progress/flow chart when useful; otherwise N/A.
- **plan_source** (required, string): Reference to PLAN.md and TASKS.md (or clear scope source).
- **current_task** (required, string): Task ID from TASKS.md currently being executed.
- **scope** (required, string): Scope this execution covers.
- **execution_log** (required, array): Step, Task ID, Action, Files, Result, Notes per step.
- **tasks_progress** (required, array): Task ID, Status, Work items done/total, notes (mirror of TASKS.md at handoff).
- **files_changed** (required, array): File path, change summary, reason, in-plan? (yes/deviation).
- **commands_run** (required, array): Command, purpose, result (pass/fail/skipped), notes.
- **verification_evidence** (required, array): Check name, command/method, result, evidence.
- **deviations** (optional, array): Deviation, reason, risk, follow-up.
- **issues_blockers** (optional, array): Issue, type, impact, next action.
- **rollback_notes** (required, string): How to roll back this execution.
- **final_status** (required, string): Completed / Partially completed / Blocked.
- **handoff** (required, string): Ready for review? Suggested focus area. List remaining `todo`/`in_progress`/`blocked` IDs.

#### `OVERVIEW.md`
- Required: yes (update in place after each card or at handoff).
- Refresh status, progress chart counts from TASKS, blockers, and next action.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Progress protocol (mandatory)

On every task card in `execution_order`:

1. **Start card:** set card Status + Progress board Status → `in_progress`; set `current_task` in EXECUTION.md.
2. **Finish a Work item:** immediately set that line to `- [x]` in TASKS.md; append a short execution_log row.
3. **Finish card:** run card Verify; if pass → Status=`done`, Progress board Done=`[x]`; if blocked → Status=`blocked` and note reason (leave unfinished Work items as `[ ]`).
4. **Stop mid-run / user stop:** leave accurate Status (`in_progress` or `blocked`); do not mark Done; handoff lists remaining IDs.
5. **Never** mark Status=`done` if Verify failed or was skipped without documenting risk + Status=`blocked`/`skipped`.
6. **Refresh OVERVIEW.md** At a glance + progress chart so a developer can skim status without opening EXECUTION.md.

```markdown
// WRONG — code done but TASKS still all todo
Implemented T-003. See EXECUTION.md.

// CORRECT — progress visible in TASKS.md
T-003 Status: done | Progress board Done: [x]
Work items: - [x] 1. …  - [x] 2. …  - [x] 3. …
```

## Quality Standards

- [ ] Every modified file is listed with a change summary.
- [ ] Every verification command has a result (pass/fail/skipped).
- [ ] Skipped checks have a documented reason and risk.
- [ ] Pre-existing failures are labeled "pre-existing" with evidence.
- [ ] Work follows TASKS.md IDs and execution_order; PLAN.md DoD/rollback are respected.
- [ ] TASKS.md Progress board, card Status, and Work item checkboxes match reality at handoff.
- [ ] Deviations from PLAN/TASKS are documented with justification.
- [ ] Rollback notes exist for all changed areas.
- [ ] Non-obvious flows, business rules, invariants, security boundaries, and
      trade-offs have concise **why/rationale** comments at the relevant
      boundary.
- [ ] Comments do not narrate obvious code and remain accurate after the
      change.

## WRONG vs CORRECT

```markdown
// WRONG — claiming done without evidence
Fixed the bug. Done.

// CORRECT — verification attached
Fix: Added null check before decrypting initial password.
Verify: `pnpm test -- password` — passed (3 tests, 0 failed).
Manual: Called endpoint with affected user — returns 200 with empty password field.
TASKS: T-012 Status=done, Work items all [x], Progress board Done=[x].
```

```markdown
// WRONG — hiding a failure
All checks passed.

// CORRECT — honest about failures
Checks:
- lint: passed
- typecheck: passed
- test: FAILED (2 pre-existing failures in unrelated payment tests, 0 new failures)
- e2e: skipped (browser env unavailable)
```

## Edge Cases

| Situation | Handling |
|---|---|
| Verification command does not exist | Note as "command unknown", add investigation to find it. |
| Fix causes new test failures | Fix within scope and re-verify. If out of scope, document as deviation. |
| Pre-existing test failures unrelated to task | Document with evidence (e.g., "failed on main branch too"). Do NOT claim these as your issue. |
| Lockfile changed unexpectedly | Document as deviation, state whether it's safe. |
| User asks to stop mid-execution | Record partial state in EXECUTION.md. Update TASKS.md to `in_progress`/`blocked` with checkboxes accurate. Handoff lists incomplete task IDs. |
| TASKS.md missing Progress board / checkboxes | Add Progress board + convert Work items to `- [ ] N. …` before or while executing; do not invent new task scope. |
| Resume after partial run | Start from first non-`done` ID in execution_order; trust unchecked Work items as remaining work. |

## Limitations

- Does NOT do independent review; use review after execution.
- Does NOT replace planning for complex tasks.
- Does NOT replace investigate when root cause is unknown.
