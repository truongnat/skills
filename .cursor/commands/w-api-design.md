# /w-api-design — Run the API design review workflow

You are executing the **api-design** workflow (**file** [`workflows/dev/w-api-design.md`](../../workflows/dev/w-api-design.md)).

## User input

$ARGUMENTS

## Instructions

1. **Read** [`workflows/dev/w-api-design.md`](../../workflows/dev/w-api-design.md) in full.
2. **Resolve inputs:** `api_intent` (required); optional `draft_contract`, `domain_stack`.
3. **Execute** steps; use `api-design-pro` for contract shape and `security-pro` + `auth-pro` for trust boundaries.
4. **Report** using [`OUTPUT_CONVENTIONS.md`](../../OUTPUT_CONVENTIONS.md); record decisions with [`templates/report/architecture-decision-record.md`](../../templates/report/architecture-decision-record.md) when needed.

## Rules

- Do not approve **breaking changes** without a versioning strategy.
- Pair with [`prompts/review/api-review-request.md`](../../prompts/review/api-review-request.md) for a single-prompt pass.
