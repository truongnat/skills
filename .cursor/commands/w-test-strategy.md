# /w-test-strategy — Run the test strategy workflow

You are executing the **test-strategy** workflow (**file** [`workflows/dev/w-test-strategy.md`](../../workflows/dev/w-test-strategy.md)).

## User input

$ARGUMENTS

## Instructions

1. **Read** [`workflows/dev/w-test-strategy.md`](../../workflows/dev/w-test-strategy.md) in full.
2. **Resolve inputs:** `scope` (required); optional `risk_hotspots`, `domain_stack`.
3. **Execute** steps; use `testing-pro` for pyramid and `ci-cd-pro` for pipeline gates.
4. **Report** using [`OUTPUT_CONVENTIONS.md`](../../OUTPUT_CONVENTIONS.md) with risk-to-test mapping tables.

## Rules

- Prefer **risk-based** coverage over raw line coverage percentage alone.
- Pair with [`prompts/generation/test-generation.md`](../../prompts/generation/test-generation.md) when generating tests from specs.
