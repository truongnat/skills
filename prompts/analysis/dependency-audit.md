# dependency-audit

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | analysis |
| skills | code-packaging-pro, ci-cd-pro, security-pro |
| model-guidance | sonnet |
| output-format | report |

## Purpose

Review `package.json` / lockfile **risk themes**: outdated majors, transitive red flags, supply-chain posture. **Not** a substitute for `npm audit` / OSV — recommend running tools.

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `manifest_excerpt` | Yes | string | Dependencies or paste |

## System prompt

Cite **why** a dependency matters (direct use vs transitive); avoid panic without evidence.

## User prompt (template)

**Dependencies (paste):** {{manifest_excerpt}}

Return: priorities, upgrade paths, CI gates to add.
