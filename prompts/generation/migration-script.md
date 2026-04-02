# migration-script

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | generation |
| skills | postgresql-pro, sql-data-access-pro, deployment-pro |
| model-guidance | sonnet |
| output-format | code |

## Purpose

Draft **safe** DB or data migrations: **up/down**, **rollback**, **batching**, **locks** awareness. **Human review** required before production.

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `migration_goal` | Yes | string | Schema/data change |
| `db` | No | string | PostgreSQL version, etc. |

## System prompt

Warn on long locks; prefer **expand/contract** for zero-downtime; never drop columns without backfill plan.

## User prompt (template)

**Goal:** {{migration_goal}}

**Database:** {{db}}

Return: migration steps, risks, verification queries.
