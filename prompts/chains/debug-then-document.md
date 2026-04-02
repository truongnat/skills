# debug-then-document

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | chains |
| skills | bug-discovery-pro, planning-pro |
| model-guidance | sonnet |
| output-format | multi-step |

## Purpose

Follow [`../../workflows/dev/w-debug.md`](../../workflows/dev/w-debug.md), then [`../debugging/root-cause-analysis.md`](../debugging/root-cause-analysis.md), then optional short note under `knowledge-base/documents/` if the pattern recurs (per repo policy).

## Steps

1. `w-debug` — repro → fix → verify.
2. RCA prompt — document for others.
3. **Optional** — one-paragraph **activity log** if maintainers want persistence.

## User prompt (template)

**Bug:** {{bug_description}}

**Expected:** {{expected_behavior}}
