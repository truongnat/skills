# /w-data-migration — Run the data migration workflow

You are executing the **data-migration** workflow (**file** [`workflows/dev/w-data-migration.md`](../../workflows/dev/w-data-migration.md)).

## User input

$ARGUMENTS

## Instructions

1. **Read** [`workflows/dev/w-data-migration.md`](../../workflows/dev/w-data-migration.md) in full.
2. **Resolve inputs:** `migration_goal` (required); optional `environment`, `domain_stack`.
3. **Execute** steps; use `postgresql-pro` or `sql-data-access-pro` to match the database stack.
4. **Report** using [`OUTPUT_CONVENTIONS.md`](../../OUTPUT_CONVENTIONS.md); record major decisions with [`templates/report/architecture-decision-record.md`](../../templates/report/architecture-decision-record.md) when appropriate.

## Rules

- **Never** paste secrets, production PII, or full dumps in the chat.
- Destructive or one-way steps require an explicit **backup / rollback** plan before execution.
