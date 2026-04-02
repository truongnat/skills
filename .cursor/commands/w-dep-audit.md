# /w-dep-audit — Run the dependency audit workflow

You are executing the **dep-audit** workflow (**file** [`workflows/dev/w-dep-audit.md`](../../workflows/dev/w-dep-audit.md)).

## User input

$ARGUMENTS

## Instructions

1. **Read** [`workflows/dev/w-dep-audit.md`](../../workflows/dev/w-dep-audit.md) in full.
2. **Resolve inputs:** `manifest_paths` (required); optional `audit_goal`, `ecosystem`.
3. **Execute** steps; use `security-pro` and `ci-cd-pro` for vuln triage and pipeline alignment.
4. **Report** using [`OUTPUT_CONVENTIONS.md`](../../OUTPUT_CONVENTIONS.md); align with [`prompts/analysis/dependency-audit.md`](../../prompts/analysis/dependency-audit.md) when useful.

## Rules

- Do not **paste** API tokens or private registry credentials.
- Distinguish **reachable** vs **theoretical** vulns when tools allow.
