# Workflow: implement-content-analysis

Analyze **user-provided** documents, images, or video and produce a **structured report** using skill **`content-analysis-pro`**, with optional handoff to **`business-analysis-pro`** or **`security-pro`**.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-content-analysis` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `sources` | Yes | What was provided (files, paste, URLs policy) |
| `goal` | Yes | Summarize, extract, compare, timeline, assess |
| `constraints` | No | Length, language, redaction, audience |

## Outputs

| Variable | Description |
|----------|-------------|
| `report` | Structured findings + evidence map |
| `limits` | Uncertainty and gaps |
| `handoff` | BA or security follow-up if needed |

## Steps

### Step 1 — `frame-and-method`

- **Type:** skill
- **Skill:** `content-analysis-pro`
- **Input:** `sources`, `goal`, `constraints`
- **Output:** analysis plan — [references/analysis-methods-and-frames.md](../../skills/content-analysis-pro/references/analysis-methods-and-frames.md)

### Step 2 — `analyze-and-draft`

- **Type:** skill
- **Skill:** `content-analysis-pro`
- **Input:** `sources` + plan
- **Output:** `report` draft — follow [references/reporting-and-limitations.md](../../skills/content-analysis-pro/references/reporting-and-limitations.md), [references/tips-and-tricks.md](../../skills/content-analysis-pro/references/tips-and-tricks.md)

### Step 3 — `limits-and-handoff`

- **Type:** skill
- **Skill:** `content-analysis-pro` (+ **`business-analysis-pro`** / **`security-pro`**)
- **Input:** draft report
- **Output:** `limits` + `handoff` — [references/edge-cases.md](../../skills/content-analysis-pro/references/edge-cases.md); promote to **`business-analysis-pro`** when outputs become requirements; **`security-pro`** for redaction or sensitive content
