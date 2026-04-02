# plan-then-implement

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | chains |
| skills | planning-pro, domain *-pro, testing-pro |
| model-guidance | sonnet |
| output-format | multi-step |

## Purpose

Chain: **plan** → **self-review plan** → **implement** → **tests** — without mixing steps in one prompt. Each step uses a dedicated prompt file.

## Steps

1. Run [`../planning/feature-planning.md`](../planning/feature-planning.md) — freeze MVP scope.
2. Critique the plan: risks, missing NFRs, skill coverage (short message).
3. Run [`../generation/new-feature.md`](../generation/new-feature.md) with the frozen scope.
4. Run [`../generation/test-generation.md`](../generation/test-generation.md).
5. Run [`../review/code-review-request.md`](../review/code-review-request.md) on the proposed diff (or description).

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `feature_goal` | Yes | string | Goal |
| `stack` | No | string | Stack |

## User prompt (template)

Execute steps 1–5 in order for:

**Goal:** {{feature_goal}}

**Stack:** {{stack}}

**Rule:** Do not skip self-review of the plan before implementation.
