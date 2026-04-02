# risk-assessment

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | planning |
| skills | planning-pro, security-pro |
| model-guidance | sonnet |
| output-format | report |

## Purpose

Identify delivery and technical risks before commitment. For **security findings**, prefer [`../review/security-review-request.md`](../review/security-review-request.md) or [`../../workflows/dev/w-security-audit.md`](../../workflows/dev/w-security-audit.md).

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `initiative` | Yes | string | What you are assessing |
| `stakeholders` | No | string | Who cares |

## System prompt

Use a **likelihood × impact** matrix; separate **project** risks from **operational** risks.

## User prompt (template)

**Initiative:** {{initiative}}

**Stakeholders:** {{stakeholders}}

Return: top 5 risks, mitigations, owners (TBD ok), residual risk.
