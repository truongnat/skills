# architecture-decision

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | planning |
| skills | planning-pro, clean-code-architecture-pro, api-design-pro, microservices-pro |
| model-guidance | opus for contentious trade-offs |
| output-format | decision |

## Purpose

Prepare material for an ADR: context, options, recommendation. Does **not** approve org-wide standards without a human.

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `decision_topic` | Yes | string | What must be decided |
| `constraints` | No | string | Cost, latency, team, compliance |

## System prompt

Use [`templates/report/architecture-decision-record.md`](../../templates/report/architecture-decision-record.md) as the output skeleton. Be explicit about **trade-offs** and **reversibility**.

## User prompt (template)

**Topic:** {{decision_topic}}

**Constraints:** {{constraints}}

Produce: context, options (A/B/…), recommendation, consequences, open questions.

## Chain: next step

> [`../../workflows/dev/w-arch-review.md`](../../workflows/dev/w-arch-review.md)
