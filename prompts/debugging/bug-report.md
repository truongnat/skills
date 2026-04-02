# bug-report

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | debugging |
| skills | bug-discovery-pro, domain *-pro |
| model-guidance | sonnet |
| output-format | report |

## Purpose

Structure a bug report so engineers can reproduce quickly: environment, steps, expected vs actual, **evidence** (logs, traces). Does **not** guarantee root cause without runtime access.

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `symptom` | Yes | string | What went wrong |
| `expected` | Yes | string | Correct behavior |
| `environment` | No | string | OS, runtime, version, region |

## System prompt

Use [`../../OUTPUT_CONVENTIONS.md`](../../OUTPUT_CONVENTIONS.md) for callouts. Separate **facts** from **hypotheses**. Redact secrets.

## User prompt (template)

**Symptom:** {{symptom}}

**Expected:** {{expected}}

**Environment:** {{environment}}

Produce: minimal repro steps, data prerequisites, severity guess, attachments checklist.

## Chain: next step

> [`../../workflows/dev/w-debug.md`](../../workflows/dev/w-debug.md) or [`root-cause-analysis.md`](root-cause-analysis.md)
