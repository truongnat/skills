---
name: done
description: "Close a task after execution/review with DONE.md, PR_MESSAGE.md, PR_DESCRIPTION.md, and optional RELEASE_NOTE.md. (Hard contract in this SKILL.md — MUST follow.)"
---

# Done

## Language (do this first)

**Re-read `.agents/settings.yaml` now** — do not reuse a `language` value cached
earlier in this session. Write every saved artifact and reply in that `language`
(`en` or `vi`); keep code, identifiers, paths, commands, and template section
keys unchanged. If the user just edited settings, the freshly read value wins. A
direct instruction in the current user request overrides the file.

## Purpose

Close a task with clear, honest, reviewable artifacts.

Prefer inputs from `EXECUTION.md`, `REVIEW.md`, `PLAN.md` (DoD/rollback), and `TASKS.md` when present (task completion vs intended cards).

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | PLAN.md, TASKS.md when present, EXECUTION.md, REVIEW.md, diff/file changes, verification evidence, skipped checks, blockers, risks, PR/MR template, existing `.agents/memory/INDEX.md`. |
| Outputs | DONE.md, refreshed `OVERVIEW.md`, a distilled `.agents/memory/<Task-N-slug>.md` + updated `.agents/memory/INDEX.md`, PR_MESSAGE.md, PR_DESCRIPTION.md, optional RELEASE_NOTE.md. |
| Safety | Do NOT overclaim verification. Do NOT hide skipped/failed checks. Do NOT mark complete if blockers remain. Do NOT describe changes that were not made. Do NOT put secrets into final artifacts. |

### Required artifacts

#### `DONE.md`
- Required: yes
- **executive_summary** (required, array): Maximum five bullets with final status, delivered value, verification, residual risk, and next action.
- **developer_overview** (required, object): Final status, verification summary, residual risks, next action.
- **charts** (optional, array): Mermaid delivery/verification chart when useful; otherwise N/A.
- **status** (required, string): Done / Done with risks / Needs fix / Blocked / Partial.
- **summary** (required, string): Outcome-focused summary (not file list).
- **scope_completed** (required, array): Scope item, status, evidence.
- **what_changed** (required, array): Area, change summary, reason.
- **files_changed** (required, array): File path, summary.
- **verification** (required, array): Check, command/method, result, evidence.
- **review_result** (optional, string): Findings and resolution, or 'No findings.'
- **skipped_failed_checks** (optional, array): Check, status, reason, risk.
- **risks_followups** (optional, array): Item, type (risk/follow-up/blocker), impact, owner/next action.
- **handoff** (required, string): Next step, reviewer focus, QA focus, deployment notes.

#### `OVERVIEW.md`
- Required: yes (update in place to final status).
- Mark lifecycle complete or blocked; keep next action concrete.

#### Project memory (`.agents/memory/`)
- Required: yes. Persists **across tasks** (not per session) — sibling to
  `.agents/sessions/`.
- Write one distilled entry `.agents/memory/<Task-N-slug>.md` from
  `templates/MEMORY_ENTRY.template.md`, then add/refresh a one-line pointer in
  `.agents/memory/INDEX.md` (seed it from `templates/MEMORY_INDEX.template.md`
  if missing; newest on top).
- **80/20 rule (mandatory):** capture only the **vital few** — the ~20% of
  knowledge (non-obvious decisions + why, gotchas, reusable conventions,
  pointers) that will help ~80% of future work. It is **not** a changelog:
  omit anything reconstructable from git, `DONE.md`, or the code. If nothing
  durable was learned, still create the entry with `Outcome` filled and each
  section `None.` — do not pad.
- **De-duplicate:** before writing, scan `.agents/memory/INDEX.md`; if this
  supersedes or extends an existing entry, update that entry instead of adding
  a near-duplicate.

#### `PR_MESSAGE.md`
- Required: no
- Conventional commit format: feat/fix/refactor(scope): summary.

#### `PR_DESCRIPTION.md`
- Required: no
- Summary, Changes, Verification, Review Notes, Risks/Follow-ups.

#### `RELEASE_NOTE.md`
- Required: no
- Only when change is user-facing or user requests it.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Quality Standards

- [ ] Final status is one of: Done / Done with risks / Needs fix / Blocked / Partial.
- [ ] Summary describes outcome, not a file list.
- [ ] Verification distinguishes: passed / failed / skipped / not run.
- [ ] No failed check is marked as passed.
- [ ] Review result is included.
- [ ] PR_MESSAGE.md follows Conventional Commits format.
- [ ] PR_DESCRIPTION.md answers: what changed, why, how verified, reviewer focus.
- [ ] When TASKS.md exists, DONE summary reflects completed vs remaining task IDs honestly (use Progress board / Status / checkboxes; do not claim Done if open `todo`/`in_progress`/`blocked` IDs remain without documented blockers).
- [ ] A `.agents/memory/<Task-N-slug>.md` entry exists and `.agents/memory/INDEX.md` has its pointer. The entry holds only the vital few (80/20), no changelog, no padding, and does not duplicate an existing entry.

## WRONG vs CORRECT

```markdown
// WRONG — file list instead of outcome
Changed: teacher-form.tsx, teacher-service.ts, teacher-test.ts

// CORRECT — outcome-focused
Summary: Preserved teacher list search state when navigating back from detail page,
including year filter restoration and search keyword persistence.
```

```markdown
// WRONG — hiding skipped checks
Verification: all passed.

// CORRECT — honest reporting
Verification:
- typecheck: passed
- lint: passed
- unit tests: skipped (test database not available)
- e2e: skipped (browser setup unavailable)
Residual risk: Main flow not verified by automated tests. Manual check done.
```

## Edge Cases

| Situation | Handling |
|---|---|
| Task has blockers | Status = Blocked. DONE.md records blocker and suggested next action. Do NOT create PR artifacts. |
| No PR template found in repo | Use fallback template from this skill. Document in notes. |
| User only needs summary, no PR | Use Lite Mode. No file creation needed. |
| Review found issues that were fixed | Document finding → resolution → evidence in review_result section. |
| Scope changed during execution | Document deviation in DONE.md. Note whether deviation was reviewed. |
| Defect found AFTER done (reviewer/QA/PR) | Task is not done. In the same session, set DONE status → `Needs fix`, reopen the affected TASKS card(s), then follow the **Post-done defect loop** in `AGENTS.md`: fix via execution (investigate/planning first if the cause is unclear or a spec/design gap), re-run `review`, and only re-run `done` when review passes and `session.sh status` is `COMPLETE: yes`. |

## Limitations

- Does NOT auto-fix code.
- Does NOT turn unverified tasks into done.
- When TASKS.md exists, do not claim Done if open task IDs remain without documented blockers.
- If review found blockers, return to execution before done.
