---
name: investigate
description: "Investigate codebase, bugs, system behavior, or technical questions before implementing. Root-cause analysis, reproduction, impact mapping, and evidence-based recommendations. (Hard contract in this SKILL.md — MUST follow.)"
---

# Investigate

## Language (do this first)

**Re-read `.agents/settings.yaml` now** — do not reuse a `language` value cached
earlier in this session. Write every saved artifact and reply in that `language`
(`en` or `vi`); keep code, identifiers, paths, commands, and template section
keys unchanged. If the user just edited settings, the freshly read value wins. A
direct instruction in the current user request overrides the file.

## Memory (read first)

Before framing, researching, or deciding, read `.agents/memory/INDEX.md` and
open the entries whose hook matches this task. Reuse prior decisions, gotchas,
and conventions instead of re-deriving them; if memory conflicts with current
evidence, trust current evidence and note the drift. If none apply, continue.
(Memory is written by `done` — the 80/20 vital few.)

## Purpose

Find technical truth before deciding to fix, plan, or implement.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | Problem description, expected/actual behavior, logs/errors/reproduction, screenshots or screen recordings, codebase context, environment details. |
| Outputs | INVESTIGATE.md with question, status, evidence, reproduction, observed facts, hypotheses, code path, impact map, root cause, recommendation, open questions. |
| Safety | Read-only by default. Do NOT modify code unless requested. Do NOT run destructive commands. Do NOT read secrets without a clear reason. Do NOT claim root cause when evidence is insufficient. |

### Required artifacts

#### `INVESTIGATE.md`
- Required: yes
- **executive_summary** (required, array): Maximum five bullets with status, likely/confirmed cause, strongest evidence, impact, and next action.
- **developer_overview** (required, object): Investigation status, strongest hypothesis, evidence gap, next action.
- **charts** (optional, array): Mermaid cause/flow chart when useful; otherwise N/A.
- **question** (required, string): The investigation question.
- **status** (required, string): Root Cause Confirmed / Likely Root Cause / Hypotheses Identified / Needs More Evidence / Blocked.
- **context** (optional, string): Environment, version, related setup.
- **evidence** (required, array): Evidence ID, source, observation, supports hypothesis?, confidence.
- **reproduction** (optional, array): Step, action, expected, actual, result.
- **observed_facts** (required, array): Fact with source.
- **hypotheses** (optional, array): Hypothesis, supporting evidence, counter evidence, verification method, confidence.
- **code_path** (optional, array): Layer, file/component, role, observation.
- **root_cause** (optional, string): Confirmed or likely root cause.
- **impact** (required, array): Area affected, impact, confidence.
- **recommendation** (required, string): Fix recommendation / workaround / next investigation.
- **open_questions** (optional, array): Question, owner, blocking status.
- **handoff** (required, string): Ready for planning? Ready for execution? Suggested next skill.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Quality Standards

- [ ] Status is one of the defined taxonomy values.
- [ ] Observed facts have explicit sources.
- [ ] Inferences are separated from observed facts with confidence levels.
- [ ] If root cause is claimed: evidence is sufficient to explain all observed symptoms.
- [ ] Recommendation distinguishes: fix / workaround / next investigation.
- [ ] Reproduction steps include environment, preconditions, and both expected and actual results.
- [ ] When video evidence is supplied, keyframes and timestamps are cited; unsampled transitions and audio are documented as limitations.

## WRONG vs CORRECT

```markdown
// WRONG — no source, no confidence
The bug is probably in the export service.

// CORRECT — evidence-based
Observation: `GET /api/export` returns 500 when user 11716 is in the result set.
Stack trace: `DecryptInitialPassword()` throws on line 42 of `encryption.ts`.
Hypothesis H-001: The encrypted value for this user was set by Keycloak directly (plaintext).
Evidence: Keycloak audit log shows password was reset via admin console for user 11716.
Confidence: Medium.
```

```markdown
// WRONG — claiming root cause without evidence
Root cause: caching issue.

// CORRECT — qualified root cause
Root cause: Likely the encrypted attribute is plaintext, causing decryption to fail.
Confidence: Medium.
Alternative hypothesis: The encryption key changed between runs (low probability, no evidence).
Next step: Inspect the database value for user 11716's password attribute safely.
```

## Edge Cases

| Situation | Handling |
|---|---|
| Cannot reproduce the issue | Status = Not Reproduced. Document conditions tried and possible reasons. |
| Log is truncated or incomplete | Document as limitation. Do NOT over-claim from partial data. |
| Sensitive data in logs (PII, tokens) | Redact before quoting. Document as security risk if exposure is found. |
| Multiple root causes are possible | List as multiple hypotheses with confidence for each. Do NOT pick one arbitrarily. |
| Issue is environment-specific | Document environment differences. Recommend cross-env comparison. |
| Screen recording is supplied | Extract session-local keyframes with `.agents/tools/video-keyframes/extract.py`; cite specific frames and do not infer continuous behavior from samples. |

## Limitations

- Does NOT guarantee a fix exists.
- Does NOT replace planning or execution.
- Does NOT replace deep security audit.
