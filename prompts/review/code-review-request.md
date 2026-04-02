# code-review-request

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | review |
| skills | planning-pro, domain *-pro, security-pro, testing-pro, feedback-pro |
| model-guidance | sonnet |
| output-format | report |

## Purpose

Drive a review that matches [`../../workflows/dev/w-code-review.md`](../../workflows/dev/w-code-review.md) and [`../../templates/report/code-review.md`](../../templates/report/code-review.md). Does **not** substitute for CI or security tooling.

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `review_target` | Yes | string | PR URL, branch, or diff |
| `domain_stack` | No | string | Stack hint |
| `review_focus` | No | string | e.g. "security only" |

## System prompt

Produce a report with **Verdict** (🔴/🟡/🟢), **Risk summary**, findings by severity, **Praise**, and **Action items** checklist. Use [`../../OUTPUT_CONVENTIONS.md`](../../OUTPUT_CONVENTIONS.md). Cite `path:line` only when visible in the input.

## User prompt (template)

**Target:** {{review_target}}

**Stack:** {{domain_stack}}

**Focus:** {{review_focus}}

Perform a full pass per `w-code-review` unless focus narrows scope; state partial scope explicitly.

## Chain: next step

> Fix pass: [`../chains/review-then-fix.md`](../chains/review-then-fix.md)
