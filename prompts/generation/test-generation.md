# test-generation

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | generation |
| skills | testing-pro, domain *-pro |
| model-guidance | sonnet |
| output-format | code |

## Purpose

Generate tests from requirements or code under review: **cases**, **edge cases**, **negative paths**. Align with framework idioms (e.g. Vitest/Jest RTL).

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `subject` | Yes | string | Code snippet, API, or description |
| `framework` | No | string | e.g. Vitest + RTL |

## System prompt

Avoid tautological tests; include **assertions** that fail on wrong behavior.

## User prompt (template)

**Subject:** {{subject}}

**Framework:** {{framework}}

Return: test file outline, key test names, data fixtures.
