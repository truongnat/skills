---
name: investigate
description: Investigate codebase, bugs, system behavior, or technical questions before implementing. Root-cause analysis, reproduction, impact mapping, and evidence-based recommendations.
---

# Investigate

## Purpose

Find technical truth before deciding to fix, plan, or implement.

## XML Contract

```xml
<Contract>
  <Inputs>Problem description, expected/actual behavior, logs/errors/reproduction, codebase context, environment details.</Inputs>
  <Outputs>INVESTIGATE.md with question, status, evidence, reproduction, observed facts, hypotheses, code path, impact map, root cause, recommendation, open questions.</Outputs>
  <Artifacts>
    <File name="INVESTIGATE.md" required="true">
      <Schema>
        <field name="question" type="string" required="true">The investigation question.</field>
        <field name="status" type="string" required="true">Root Cause Confirmed / Likely Root Cause / Hypotheses Identified / Needs More Evidence / Blocked.</field>
        <field name="context" type="string" required="false">Environment, version, related setup.</field>
        <field name="evidence" type="array" required="true">Evidence ID, source, observation, supports hypothesis?, confidence.</field>
        <field name="reproduction" type="array" required="false">Step, action, expected, actual, result.</field>
        <field name="observed_facts" type="array" required="true">Fact with source.</field>
        <field name="hypotheses" type="array" required="false">Hypothesis, supporting evidence, counter evidence, verification method, confidence.</field>
        <field name="code_path" type="array" required="false">Layer, file/component, role, observation.</field>
        <field name="root_cause" type="string" required="false">Confirmed or likely root cause.</field>
        <field name="impact" type="array" required="true">Area affected, impact, confidence.</field>
        <field name="recommendation" type="string" required="true">Fix recommendation / workaround / next investigation.</field>
        <field name="open_questions" type="array" required="false">Question, owner, blocking status.</field>
        <field name="handoff" type="string" required="true">Ready for planning? Ready for execution? Suggested next skill.</field>
      </Schema>
    </File>
  </Artifacts>
  <Safety>Read-only by default. Do NOT modify code unless requested. Do NOT run destructive commands. Do NOT read secrets without a clear reason. Do NOT claim root cause when evidence is insufficient.</Safety>
</Contract>
```

## Quality Standards

- [ ] Status is one of the defined taxonomy values.
- [ ] Observed facts have explicit sources.
- [ ] Inferences are separated from observed facts with confidence levels.
- [ ] If root cause is claimed: evidence is sufficient to explain all observed symptoms.
- [ ] Recommendation distinguishes: fix / workaround / next investigation.
- [ ] Reproduction steps include environment, preconditions, and both expected and actual results.

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

## Limitations

- Does NOT guarantee a fix exists.
- Does NOT replace planning or execution.
- Does NOT replace deep security audit.
