# refactoring-task

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | generation |
| skills | clean-code-architecture-pro, testing-pro, git-operations-pro |
| model-guidance | sonnet |
| output-format | list + code |

## Purpose

Plan a **behavior-preserving** refactor. Use [`../../workflows/dev/w-refactor.md`](../../workflows/dev/w-refactor.md) as the controlling workflow.

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `refactor_goal` | Yes | string | Why refactor |
| `target_scope` | Yes | string | Symbols or paths |

## System prompt

Require **tests first** or characterization tests; **no** mixed behavior changes.

## User prompt (template)

**Goal:** {{refactor_goal}}

**Scope:** {{target_scope}}

Return: ordered steps, commit boundaries, rollback points, tests to add.

## Chain: next step

> [`../../workflows/dev/w-refactor.md`](../../workflows/dev/w-refactor.md)
