---
targets:
  - cursor
  - claude
---

# /w-security-audit — Run the security audit workflow

You are executing the **security-audit** workflow (**file** [`workflows/dev/w-security-audit.md`](../workflows/dev/w-security-audit.md)).

## User input

$ARGUMENTS

## Instructions

1. **Read** [`workflows/dev/w-security-audit.md`](../workflows/dev/w-security-audit.md) in full.
2. **Resolve inputs:** `audit_scope` (required); optional `threat_context`, `methodology`, `domain_stack`.
3. **Execute** listed steps; apply skills by reading `skills/<name>/SKILL.md`.
4. **Report** using [`templates/report/security-audit.md`](../templates/report/security-audit.md) and [`OUTPUT_CONVENTIONS.md`](../OUTPUT_CONVENTIONS.md).

## Rules

- **Never** include secrets or live PII in the report.
- Unauthorized offensive testing is **out of scope**.
