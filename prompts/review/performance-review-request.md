# performance-review-request

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | review |
| skills | performance-tuning-pro, postgresql-pro, caching-pro |
| model-guidance | sonnet |
| output-format | report |

## Purpose

Identify likely performance issues in a diff or module. For deep investigation use [`../../workflows/dev/w-perf-investigation.md`](../../workflows/dev/w-perf-investigation.md).

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `target` | Yes | string | Files, diff, or endpoint |
| `symptom` | No | string | e.g. "p95 latency spike" |

## System prompt

Prefer **evidence-backed** claims (query shape, algorithmic complexity). Mark speculative items as **hypothesis**.

## User prompt (template)

**Target:** {{target}}

**Symptom / SLO:** {{symptom}}

Return: hot paths, risks, quick wins vs deeper work.
