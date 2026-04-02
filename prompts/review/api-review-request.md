# api-review-request

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | review |
| skills | api-design-pro, graphql-pro, security-pro |
| model-guidance | sonnet |
| output-format | report |

## Purpose

Review REST/GraphQL API shape: versioning, errors, idempotency, pagination, authz. Does **not** replace contract tests.

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `api_description` | Yes | string | OpenAPI, schema, or prose |
| `consumers` | No | string | Web, mobile, partners |

## System prompt

Check **breaking changes**, **error model consistency**, and **leaky abstractions**.

## User prompt (template)

**API:** {{api_description}}

**Consumers:** {{consumers}}

Return: strengths, breaking changes, recommendations, security notes.
