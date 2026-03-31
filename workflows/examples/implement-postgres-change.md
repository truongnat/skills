# Workflow: implement-postgres-change

Design or change PostgreSQL (schema, index, migration, query) from spec through operational risk review, using skill **`postgresql-pro`**.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-postgres-change` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `change_spec` | Yes | Tables/columns/indexes, constraints, RLS/policies if any, estimated volume, maintenance window if any |
| `pg_version` | No | PostgreSQL major if known (syntax / planner differences) |

## Outputs

| Variable | Description |
|----------|-------------|
| `migration_plan` | Ordered SQL/migration steps + suggested rollback |
| `review_notes` | Ops and locking notes |

## Steps

### Step 1 — `spec-to-plan`

- **Type:** skill
- **Skill:** `postgresql-pro`
- **Input:** Normalize `change_spec`: additive vs breaking, FKs, `CONCURRENTLY` indexes, role grants, RLS (`ENABLE ROW LEVEL SECURITY`, policy `USING`/`WITH CHECK`, tenant context).
- **Output:** `migration_plan` (safe ordering)

### Step 2 — `implement-sql`

- **Type:** skill
- **Skill:** `postgresql-pro`
- **Input:** `migration_plan` + `change_spec`
- **Output:** SQL / migration files — follow [references/schema-and-query-design.md](../../skills/postgresql-pro/references/schema-and-query-design.md) and [references/tips-and-tricks.md](../../skills/postgresql-pro/references/tips-and-tricks.md)

### Step 3 — `ops-and-edge-review`

- **Type:** skill
- **Skill:** `postgresql-pro`
- **Input:** Draft SQL
- **Output:** `review_notes` — check [references/edge-cases.md](../../skills/postgresql-pro/references/edge-cases.md), [references/row-level-security.md](../../skills/postgresql-pro/references/row-level-security.md) if RLS is enabled, and the checklist in `SKILL.md`
