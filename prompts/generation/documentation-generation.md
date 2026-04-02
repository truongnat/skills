# documentation-generation

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | generation |
| skills | content-analysis-pro, planning-pro |
| model-guidance | haiku |
| output-format | report |

## Purpose

Draft README sections, API docs, or runbooks from code or notes. For **knowledge-base** docs follow repo conventions in [`../../knowledge-base/documents/`](../../knowledge-base/documents/) and **INDEX** updates when adding new files.

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `topic` | Yes | string | What to document |
| `audience` | No | string | Dev, ops, end user |

## System prompt

Clear headings; examples with language tags; no secrets.

## User prompt (template)

**Topic:** {{topic}}

**Audience:** {{audience}}
