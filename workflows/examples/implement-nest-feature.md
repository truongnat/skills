# Workflow: implement-nest-feature

Implement a NestJS feature (module/controller/service/DTO) from spec through review (API/DX + edge cases), using skill **`nestjs-pro`**.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-nest-feature` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `feature_spec` | Yes | Endpoints, domain rules, auth, persistence, PostgreSQL RLS / tenant context if any (Markdown or bullets) |
| `stack` | No | Nest major, ORM (Prisma/TypeORM/…), transport if any |

## Outputs

| Variable | Description |
|----------|-------------|
| `implementation` | Module + suggested code + checklist |
| `review_notes` | Risks (migration, security, scale) |

## Steps

### Step 1 — `spec-to-plan`

- **Type:** skill
- **Skill:** `nestjs-pro`
- **Input:** Normalize `feature_spec`: module boundaries, DTOs, guards, HTTP errors, transaction boundaries, RLS (`SET LOCAL` / pool + ORM).
- **Output:** `plan` (files to add/edit, providers, tokens)

### Step 2 — `implement`

- **Type:** skill
- **Skill:** `nestjs-pro`
- **Input:** `plan` + `feature_spec`
- **Output:** `code` — follow [references/api-design-and-dx.md](../../skills/public/nestjs-pro/references/api-design-and-dx.md), [references/tips-and-tricks.md](../../skills/public/nestjs-pro/references/tips-and-tricks.md), and [references/postgresql-rls-integration.md](../../skills/public/nestjs-pro/references/postgresql-rls-integration.md) when using RLS

### Step 3 — `edge-and-security-review`

- **Type:** skill
- **Skill:** `nestjs-pro`
- **Input:** `code`
- **Output:** `review_notes` — check [references/edge-cases.md](../../skills/public/nestjs-pro/references/edge-cases.md), [references/postgresql-rls-integration.md](../../skills/public/nestjs-pro/references/postgresql-rls-integration.md), skill **`postgresql-pro`** ([row-level-security.md](../../skills/public/postgresql-pro/references/row-level-security.md)) when RLS applies; checklist in `SKILL.md`
