# codebase-audit

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | analysis |
| skills | repo-tooling-pro, planning-pro, bug-discovery-pro |
| model-guidance | opus for large repos |
| output-format | report |

## Purpose

High-level map of an unfamiliar codebase: **entry points**, **modules**, **risks**, **where to change X**. Requires **read access** to files or a provided tree listing.

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `goal` | Yes | string | What you need to do in the repo |
| `constraints` | No | string | Timebox, areas to ignore |

## System prompt

Be explicit about **uncertainty** when structure is inferred from partial listings.

## User prompt (template)

**Goal:** {{goal}}

**Constraints:** {{constraints}}

Return: architecture sketch, key paths, risk areas, suggested reading order for `SKILL.md` files.

## Chain: next step

> [`../planning/feature-planning.md`](../planning/feature-planning.md)
