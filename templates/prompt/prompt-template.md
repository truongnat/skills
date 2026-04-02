# {{prompt-name}}

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | planning \| review \| debugging \| generation \| analysis |
| skills | comma-separated `*-pro` skills this prompt activates |
| model-guidance | sonnet (balanced) \| opus (complex) \| haiku (fast) |
| output-format | report \| code \| list \| decision |

## Purpose

One paragraph: job solved; when to use vs similar prompts; what it does **not** do.

## Variables

| Name | Required | Type | Description | Example |
|------|----------|------|-------------|---------|
| `example` | Yes | string | … | `"…"` |

## System prompt

Persona + constraints + output format + quality bar.

## User prompt (template)

Structured prompt with `{{variable}}` placeholders.

## Few-shot examples

### Example 1 — simple

**Input:** …

**Expected output shape:** …

### Example 2 — edge case

…

## Chain: next step

> If this prompt produces X, follow with: [`path/to/next.md`](../…)
