# review-then-fix

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | chains |
| skills | feedback-pro, domain *-pro |
| model-guidance | sonnet |
| output-format | multi-step |

## Purpose

Apply [`../review/code-review-request.md`](../review/code-review-request.md) then address **blockers and important** items only; re-run a focused review.

## Steps

1. Full review (`code-review-request`).
2. Implement fixes (minimal diffs).
3. Re-run review with `review_focus` = "diff-only" or "blockers resolved".

## User prompt (template)

**Target:** {{review_target}}

**Stack:** {{domain_stack}}
