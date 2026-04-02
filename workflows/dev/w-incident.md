# Workflow: incident

Structured **production incident response**: triage → mitigate → communicate → resolve → follow-up. Complements `w-debug` (technical root cause) with coordination and reporting.

**Domain:** `dev` — **`workflows/dev/`**. **Filename:** `w-incident.md`.

**Invoke:** `/w-incident`

## Metadata

| Field | Value |
|-------|-------|
| **id** | `incident` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `incident_summary` | Yes | What broke, who is affected, how detected |
| `severity_guess` | No | SEV-1 … SEV-4 |
| `domain_stack` | No | For technical response |

## Outputs

| Variable | Description |
|----------|-------------|
| `incident_report` | Timeline, impact, actions |
| `comms_draft` | Status update for stakeholders |
| `post_incident_actions` | Follow-ups |

## Decision paths

- **SEV-1 / data loss:** Mitigate first (Step 2); communicate early (Step 3).
- **False alarm:** Close with short **negative incident** note; still log detection gap.
- **Security suspected:** Invoke `security-pro`; coordinate with `w-security-audit` after containment.

## Error handling

- **Rollback failed:** Next option: feature flag off, scale out, traffic shift — document each attempt.
- **Root cause unknown at close:** Mark **preliminary**; schedule `w-debug` / postmortem.

## Output format

Follow **[`OUTPUT_CONVENTIONS.md`](../../OUTPUT_CONVENTIONS.md)**.  
Final artifact MUST align with **[`templates/report/incident-report.md`](../../templates/report/incident-report.md)**.

## Time estimate

| Depth | When | Rough time |
|-------|------|------------|
| **Quick** | Minor glitch | < 1 h active |
| **Standard** | User-visible outage | 2–8 h |
| **Deep** | Multi-region / data recovery | days |

## Escalation

- **Human:** Customer comms, legal, exec escalation, vendor support.
- **Autonomous:** Runbook steps, log gathering, draft timeline and report.

## Steps

### Step 1 — `triage-and-severity`

- **Type:** skill
- **Skill:** `planning-pro`
- **Input:** `incident_summary`, `severity_guess`
- **Output:** Severity, owner, **first 15 min** checklist.

### Step 2 — `mitigate`

- **Type:** skill
- **Skill:** `deployment-pro` + domain `*-pro` (rollback, restart, scale, flag)
- **Input:** Symptoms
- **Output:** Service restored or impact reduced; **evidence** of mitigation.

### Step 3 — `communicate`

- **Type:** skill
- **Skill:** `feedback-pro`
- **Input:** Status + ETA
- **Output:** `comms_draft` (internal/external as appropriate).

### Step 4 — `technical-root-cause` (parallel-friendly)

- **Type:** skill
- **Skill:** `bug-discovery-pro` + `w-debug` (as sub-workflow)
- **Input:** Traces, deploys, diffs
- **Output:** Confirmed or **hypothesis** with verification plan.

### Step 5 — `close-and-follow-up`

- **Type:** skill
- **Skill:** `planning-pro` + `feedback-pro`
- **Input:** Steps 1–4
- **Output:** `incident_report`, `post_incident_actions` using incident template.

## Notes

- **Never** share secrets or PII in incident channels; use **redacted** links.
