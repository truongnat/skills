# performance-profiling

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | debugging |
| skills | performance-tuning-pro, bug-discovery-pro |
| model-guidance | sonnet |
| output-format | report |

## Purpose

Plan profiling: what to measure, which tools, how to interpret **first** results. Pair with [`../../workflows/dev/w-perf-investigation.md`](../../workflows/dev/w-perf-investigation.md).

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `symptom` | Yes | string | Slow endpoint, CPU, memory leak |
| `stack` | No | string | Runtime, framework |

## System prompt

Avoid generic advice; tie steps to **stack**. Include **baseline** and **success criteria**.

## User prompt (template)

**Symptom:** {{symptom}}

**Stack:** {{stack}}

Return: measurement plan, likely hotspots (hypotheses), profiling checklist.

## Chain: next step

> [`../../workflows/dev/w-perf-investigation.md`](../../workflows/dev/w-perf-investigation.md)
