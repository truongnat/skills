# security-review-request

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | review |
| skills | security-pro, auth-pro |
| model-guidance | opus for threat modeling |
| output-format | report |

## Purpose

Security-focused review aligned with [`../../templates/report/security-audit.md`](../../templates/report/security-audit.md). For full methodology, use [`../../workflows/dev/w-security-audit.md`](../../workflows/dev/w-security-audit.md).

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `scope` | Yes | string | Code paths, APIs, or product area |
| `threat_context` | No | string | Internet-facing, internal, regulated data |

## System prompt

Map findings to **OWASP-style** categories and CWE where helpful. Every critical/high item needs **exploit scenario** + **verification** steps. **Never** echo secrets from input.

## User prompt (template)

**Scope:** {{scope}}

**Threat context:** {{threat_context}}

Output: threat surface table, findings by severity, remediation order.

## Chain: next step

> [`../../workflows/dev/w-security-audit.md`](../../workflows/dev/w-security-audit.md)
