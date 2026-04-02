# Workflow: debug

Systematic **debugging** workflow using the scientific method: reproduce → hypothesize → isolate → fix → verify. Works for runtime errors, logic bugs, performance regressions, and intermittent failures.

**Domain:** `dev` — lives under **`workflows/dev/`**. **Filename:** `w-debug.md`.

**Invoke:** `/w-debug`

## Metadata

| Field | Value |
|-------|-------|
| **id** | `debug` |
| **version** | 1.1 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `bug_description` | Yes | Observed behavior, error message, stack trace, or symptom |
| `expected_behavior` | Yes | What should happen instead |
| `domain_stack` | No | Stack hint (e.g., "React + NestJS") — maps to `*-pro` skills |
| `repro_steps` | No | Minimal steps to reproduce; leave empty if unknown |

## Decision paths

- **Cannot reproduce after 2 structured attempts:** Widen inputs (env, seed, data); go to Step 2 with **logging plan**; if still blocked, stop with **repro gap** list — do not fix.
- **Intermittent only:** Add instrumentation first (Step 2); prefer stress/race tools before code changes.
- **Suspected security incident:** Add `security-pro` in Step 3; do not post secrets in logs.
- **Production only:** Prioritize evidence from traces/metrics; treat local fix as hypothesis until verified against prod-like env.

## Error handling

- **Wrong root cause disproved:** Return to Step 3; do not stack fixes without verification.
- **Fix breaks tests:** Roll back fix; re-isolate; add failing test before re-applying.
- **No access to runtime:** Output **hypothesis + verification steps** only; label confidence **Low**.

## Output format

Use **[`OUTPUT_CONVENTIONS.md`](../../OUTPUT_CONVENTIONS.md)** for severity and progress tables when reporting status.  
Root-cause write-up should include: **evidence**, **falsified alternatives**, **minimal fix**, **regression guard** — structure compatible with `prompts/debugging/root-cause-analysis.md` when used as a companion prompt.

## Time estimate

| Depth | When | Rough time |
|-------|------|------------|
| **Quick** | Obvious stack trace, single-file bug | < 30 min |
| **Standard** | Multi-module or needs bisect | 1–3 h |
| **Deep** | Intermittent, perf, distributed | > 3 h |

## Escalation

- **Autonomous:** Repro, isolate, minimal fix, test in dev/CI.
- **Human:** Data loss, ongoing outage, **security breach**, need for prod access or on-call; **legal/compliance** review.

## Outputs

| Variable | Description |
|----------|-------------|
| `root_cause` | Confirmed root cause with evidence |
| `fix` | Code change or configuration fix |
| `regression_guard` | Test or assertion that prevents recurrence |
| `postmortem_note` | Optional: what failed in process, not just in code |

## Steps

### Step 1 — `classify-and-reproduce`

- **Type:** skill
- **Skill:** `bug-discovery-pro` (+ domain skills from Step 0)
- **Input:** `bug_description`, `repro_steps`
- **Actions:**
  1. Classify bug type: crash / logic error / performance regression / intermittent / data corruption.
  2. Write a **minimal reproduction case** — smallest code that triggers the bug.
  3. Confirm the bug is reproducible before proceeding; do not hypothesize before reproducing.
  4. Record environment: OS, runtime version, dependencies, data state.
- **Output:** Confirmed repro steps + classification.

### Step 2 — `gather-evidence`

- **Type:** skill
- **Skill:** Domain `*-pro` skills (e.g., `react-pro` for UI bugs, `postgresql-pro` for DB bugs)
- **Input:** Repro case from Step 1
- **Actions:**
  1. Read error messages and stack traces carefully — note file, line, and call chain.
  2. Add logging or breakpoints at key points; observe actual vs expected values.
  3. Check recent changes: `git log --oneline -20`, `git diff HEAD~5`.
  4. For intermittent bugs: add retry counter; identify timing or concurrency patterns.
- **Output:** Evidence list: what was observed, where, under what conditions.

### Step 3 — `form-hypotheses`

- **Type:** skill
- **Skill:** Domain `*-pro` + `algorithm-pro` (for logic bugs) + `security-pro` (if security-adjacent)
- **Input:** Evidence from Step 2
- **Actions:**
  1. List 2–4 plausible root causes ranked by likelihood.
  2. For each hypothesis, state: "If this is true, then [observable effect] should occur."
  3. Design a minimal test for each hypothesis (code change, log, assertion).
  4. Prioritize the hypothesis that explains ALL observed symptoms.
- **Output:** Ranked hypothesis list with falsification tests.

### Step 4 — `isolate-root-cause`

- **Type:** skill
- **Skill:** Domain `*-pro`
- **Input:** Hypotheses from Step 3
- **Actions:**
  1. Test hypotheses from most-to-least likely; eliminate each definitively.
  2. Use binary search: comment out half the code path; narrow to the smallest unit.
  3. Check assumptions: verify input data, library versions, configuration values.
  4. For edge cases: test with boundary values (empty, null, zero, max, concurrent).
- **Output:** `root_cause` — confirmed single cause with evidence.

### Step 5 — `implement-fix`

- **Type:** skill
- **Skill:** Domain `*-pro`
- **Input:** `root_cause`
- **Actions:**
  1. Write the minimal fix that addresses the root cause (not symptoms).
  2. Avoid over-engineering: fix the bug, don't refactor the module.
  3. Consider side effects: what else does this code path affect?
  4. Document the fix with a comment if the cause was non-obvious.
- **Output:** `fix` — code change.

### Step 6 — `verify-and-guard`

- **Type:** skill
- **Skill:** `testing-pro`
- **Input:** `fix`, repro case from Step 1
- **Actions:**
  1. Re-run the repro steps — confirm bug is gone.
  2. Run existing test suite — confirm no regressions.
  3. Write a **regression test** that fails without the fix and passes with it.
  4. For intermittent bugs: run test under load or with race detector.
- **Output:** `regression_guard` — test that prevents recurrence.

### Step 7 — `postmortem-note` (optional)

- **Type:** skill
- **Skill:** `planning-pro` + `feedback-pro`
- **Input:** Steps 1–6 findings
- **Actions:**
  1. Note **time-to-reproduce**: was it easy? If not, what tooling/logging would have helped?
  2. Note **root cause category**: was this preventable? (type error → add TypeScript; missing test → add coverage; unclear API → add docs).
  3. Record in `knowledge-base/documents/` if the pattern may recur.
- **Output:** `postmortem_note` — 3–5 bullet process improvement observations.

## Debugging heuristics (quick reference)

| Symptom | First hypothesis |
|---------|-----------------|
| Works locally, fails in CI | Environment diff: env vars, Node version, file paths |
| Fails only under load | Race condition, connection pool exhaustion |
| NaN / undefined in output | Missing null check or incorrect key name |
| Memory grows over time | Missing cleanup: event listeners, intervals, large arrays |
| Intermittent test failure | Shared state between tests, time-dependent assertions |
| Error after dependency upgrade | Breaking API change in new version; check changelog |
| Works for admin, fails for user | Missing authorization check |

## Notes

- **Never skip Step 1** — fixing without reproducing is guessing; guesses often introduce new bugs.
- **One hypothesis at a time** — changing multiple things simultaneously makes it impossible to know what fixed it.
- **The fix should be smaller than the investigation** — if the fix is large, you may be fixing the wrong thing.
- Use `git bisect` for regressions introduced in recent commits.
