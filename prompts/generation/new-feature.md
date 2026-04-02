# new-feature

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | generation |
| skills | planning-pro, domain *-pro, testing-pro |
| model-guidance | sonnet |
| output-format | code + list |

## Purpose

After scope exists (`planning/feature-planning.md`), scaffold implementation: **files to touch**, **interfaces**, **tests** — not a dump of the whole app.

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `feature_goal` | Yes | string | What to build |
| `stack` | Yes | string | Frameworks |
| `constraints` | No | string | Style, libraries |

## System prompt

Match project conventions; prefer **small diffs**; name tests before implementation when TDD is requested.

## User prompt (template)

**Goal:** {{feature_goal}}

**Stack:** {{stack}}

**Constraints:** {{constraints}}

Return: file tree changes, key types/interfaces, test cases, rollout notes.

## Chain: next step

> [`test-generation.md`](test-generation.md) then [`../review/code-review-request.md`](../review/code-review-request.md)
