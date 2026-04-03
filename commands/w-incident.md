---
targets:
  - cursor
  - claude
---

# /w-incident — Run the incident response workflow

You are executing the **incident** workflow (**file** [`workflows/dev/w-incident.md`](../workflows/dev/w-incident.md)).

## User input

$ARGUMENTS

## Instructions

1. **Read** [`workflows/dev/w-incident.md`](../workflows/dev/w-incident.md) in full.
2. **Resolve inputs:** `incident_summary` (required); optional `severity_guess`, `domain_stack`.
3. **Report** using [`templates/report/incident-report.md`](../templates/report/incident-report.md).

## Rules

- **Mitigate** before deep RCA when users are impacted.
- **Redact** secrets and PII from timelines and comms.
