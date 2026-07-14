---
name: sync
description: "Read-only sync of session artifacts, codebase context, git state, dirty changes, dependency/config drift, plan mismatch, and blockers before execution. (Hard contract in this SKILL.md — MUST follow.)"
---

# Sync

## Purpose

Ensure the agent has the latest, reliable, and safe state before execution.

This skill focuses on:

- Sync session artifacts: DISCUSSION.md, PLAN.md, TASKS.md, EXECUTION.md, REVIEW.md.
- Refresh codebase context at plan-relevant scope.
- Check workspace and git state.
- Detect drift between PLAN/TASKS and current codebase.
- Detect dirty changes, conflicts, or out-of-scope modifications.
- Check dependency/config when the plan requires it.
- Check for missing or renamed files, and outdated assumptions.
- Identify blockers before modifying code.
- Record facts, risks, drift, and next steps.
- Maintain read-only mode by default.

The goal: avoid executing against stale context, wrong plans, dirty workspaces, drifted dependencies, or outdated assumptions.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | Session path, PLAN.md, TASKS.md, workspace state, git state, dependency/config metadata, known affected files, user constraints. |
| Outputs | Sync summary with observed facts, inferred context, drift, dirty changes, risks, blockers, recommended next step. |
| Safety | Read-only by default. Do NOT mutate workspace. Do NOT read secrets or sensitive files without a clear reason. Do NOT run destructive commands. Do NOT auto-resolve conflicts or unrelated dirty changes. Do NOT move to execution when PLAN.md or TASKS.md is stale, PLAN Ready=No / open blockers, SYNC.md is older than PLAN/TASKS, or blockers are unhandled. |

### Required artifacts

#### `EXECUTION.md`
- Required: no
- Append sync summary if workflow requires it. Not required for Lite Mode.

#### `SYNC.md`
- Required: no
- Optional standalone sync report for Full Mode.

#### `schema`
- Required: shared (applies to sync report content)
- **scope** (required, string): What was synced (artifacts, workspace, git, dependencies).
- **observed_facts** (required, array): List of observed facts with source for each.
- **inferred_context** (optional, array): Inferences with basis and confidence level.
- **drift_detected** (optional, array): Drift items with type, impact, suggested action.
- **dirty_changes** (optional, array): Classified dirty changes with scope check (in-scope/out-of-scope/unknown).
- **risks_blockers** (required, array): Blockers with type, impact, next action.
- **recommendation** (required, string): Ready for execution: Yes/No. Suggested next step.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## When to Use

Use this skill when:

- After `planning` and before `execution`.
- Session is old or context may be stale.
- User returns to a task after some time.
- Need to refresh context before modifying code.
- Need to check workspace state.
- Need to check git state.
- Need to check dirty changes or conflicts.
- Need to read existing session artifacts.
- Need to map codebase at plan-relevant scope.
- Need to verify the plan still matches the codebase.
- Need to check dependency/config at read-only level.
- Need to identify blockers before execution.
- Need to avoid overwriting changes that are not yours.

## When NOT to Use

Do NOT use this skill when:

- Task is only brainstorming.
- Task is only planning and does not need deep repo reading.
- User explicitly says not to check repo/workspace.
- No workspace, repo, or artifact to sync.
- User is only asking general knowledge.
- User requires a review of diff after execution; use `review`.
- User requires immediate implementation of a small, clear-scope task with fresh context.
- User requires external source research; use `research`.
- User provides full context for a specific file change in the prompt.

## Sync Readiness Gate

Before moving to execution, verify:

- Session path or task context exists.
- PLAN.md and TASKS.md are present and aligned (both required before execution).
- **PLAN.md Handoff Ready = Yes** and PLAN Handoff blockers are empty/`none`. If Ready=No or open blockers exist → **not** ready for execution (recommend resolve / re-plan / ask user).
- If `SYNC.md` exists but is **older** than PLAN.md or TASKS.md (mtime or version/date) → treat prior SYNC as **stale**; rewrite SYNC.md this run.
- Workspace exists and is readable.
- Git repo is initialized if needed.
- No dirty changes outside scope.
- No conflict markers or merge/rebase state.
- Files referenced in TASKS.md still exist (or confidence unknown is documented).
- Affected areas have not drifted significantly vs PLAN/TASKS.
- Dependency/config assumptions still hold if the plan depends on them.
- No sensitive files need special handling.
- Any blockers require returning to planning or asking the user.

If readiness is not met: do NOT move to execution. Document blockers and recommend the next step.

**Full Mode:** write/update `SYNC.md` every sync run after planning changes — do not leave a pre-planning SYNC as the latest gate.

## Quality Standards

Sync output must pass these checks:

- [ ] Observed facts have clear sources (file path, command output, user statement).
- [ ] Inferred context is explicitly separated from observed facts.
- [ ] Confidence levels (High/Medium/Low) are stated for each inference.
- [ ] Drift items include type (File/API/Dependency/Config/Test/Scope/Data/Branch).
- [ ] Dirty changes are classified: in-scope, out-of-scope, unknown ownership.
- [ ] Blockers state why they block execution and what the next action is.
- [ ] Recommendation is one of: Ready for execution / Return to planning / Run investigate / Ask user / Resolve workspace / Stop.

## WRONG vs CORRECT

```markdown
// WRONG — no source, no confidence, vague
Inferred: The task touches auth.

// CORRECT — has source, confidence, and basis
Inferred: The task touches auth login flow (confidence: High).
Basis: Both PLAN.md and dirty file `src/auth/login.ts` reference the same feature code `RAB07001`.
```

```markdown
// WRONG — single line, no classification
Drift: File was renamed.

// CORRECT — typed, with impact and action
Drift Type: File Drift
Impact: Plan references `src/old.ts` but file is now `src/new.ts`. Execution would fail at verification step.
Action: Update plan file paths or inspect new location before execution.
```

## Edge Cases

| Situation | Handling |
|---|---|
| No git repo in workspace | Skip git checks, document "not a git repo" as observed fact. |
| .env file exists but not in plan scope | Do NOT read contents. Note existence as metadata only. |
| PLAN.md or TASKS.md missing | Block execution. Return to planning — both files are required (do not fold tasks into PLAN.md). |
| PLAN Handoff Ready=No or open blockers | Block execution. Resolve blockers or return to planning/ask user. |
| SYNC.md older than PLAN.md/TASKS.md | Stale sync — rewrite SYNC.md this run before any Ready recommendation. |
| TASKS.md stale vs PLAN task_index | Block execution. Return to planning to realign. |
| Dirty changes with unknown ownership | Block execution. Ask user to confirm ownership or commit/stash first. |
| Merge conflict markers detected | Block execution. Recommend conflict resolution before proceeding. |
| Workspace directory does not exist | Block. Cannot proceed without a valid workspace. |
| User says "skip sync, just do it" | Skip sync, but note the risk of stale context in execution artifact. |

## Workflow

1. Determine if sync is needed.
2. Choose Lite Mode or Full Mode.
3. Confirm workspace and session path.
4. Read relevant session artifacts in order.
5. Check sensitive file boundaries before reading files.
6. Check git repo and working tree if applicable.
7. Check dirty changes, untracked files, conflict state.
8. Check plan files/systems exist.
9. Map codebase at plan-relevant scope.
10. Check dependency/config/tooling if plan needs it.
11. Compare plan with actual state.
12. Document observed facts with sources.
13. Document inferred context separately from observed facts.
14. Document drift, risks, and blockers.
15. Recommend next step.
16. Only move to execution if state is reliable enough.

## Limitations

- This skill does NOT replace execution.
- This skill does NOT replace planning when PLAN.md or TASKS.md is stale.
- This skill does NOT replace investigate when the root cause is unknown.
- This skill does NOT write tools or automation.
- This skill does NOT auto-handle conflicts or unrelated dirty changes.
- This skill does NOT guarantee detecting all drift if context is missing.
- This skill does NOT read secrets or sensitive data without a clear reason and user permission.

## References

- [Git Status Documentation](https://git-scm.com/docs/git-status)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
