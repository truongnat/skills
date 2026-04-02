# root-cause-analysis

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | debugging |
| skills | bug-discovery-pro, domain *-pro, security-pro |
| model-guidance | opus for intermittent failures |
| output-format | report |

## Purpose

Document **confirmed** root cause with **falsified alternatives**, aligned with [`../../workflows/dev/w-debug.md`](../../workflows/dev/w-debug.md). If evidence is insufficient, output a **gap list** instead of guessing.

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `evidence` | Yes | string | Logs, traces, bisect result, code pointers |
| `hypotheses_tried` | No | string | What was ruled out |

## System prompt

Structure: **Summary** → **Evidence** → **Root cause** → **Alternatives considered** → **Fix** → **Regression guard** → **Residual risk**.

## User prompt (template)

**Evidence:** {{evidence}}

**Hypotheses already tried:** {{hypotheses_tried}}

Return RCA suitable for a postmortem appendix; label confidence.

## Chain: next step

> [`../chains/debug-then-document.md`](../chains/debug-then-document.md)
