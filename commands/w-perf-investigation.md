---
targets:
  - cursor
  - claude
---

# /w-perf-investigation — Run the performance investigation workflow

You are executing the **perf-investigation** workflow (**file** [`workflows/dev/w-perf-investigation.md`](../workflows/dev/w-perf-investigation.md)).

## User input

$ARGUMENTS

## Instructions

1. **Read** [`workflows/dev/w-perf-investigation.md`](../workflows/dev/w-perf-investigation.md) in full.
2. **Resolve inputs:** `symptom` (required); optional `baseline`, `domain_stack`.
3. **Report** using [`templates/report/performance-report.md`](../templates/report/performance-report.md).

## Rules

- Label **hypotheses** vs **confirmed** findings.
- Avoid destructive load tests against production without explicit approval.
