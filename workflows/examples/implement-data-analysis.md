# Workflow: implement-data-analysis

EDA, cleaning, visualization, or spreadsheet deliverables using skill **`data-analysis-pro`**, with optional handoff to **`business-analysis-pro`** or **`content-analysis-pro`** when the source is unstructured.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-data-analysis` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `data_path` | Yes | CSV, Parquet, SQLite path, or “in memory” description |
| `question` | Yes | What to learn or produce (chart, pivot, `.xlsx`) |
| `constraints` | No | Privacy, row limits, Python version |

## Outputs

| Variable | Description |
|----------|-------------|
| `plan` | Steps and libraries |
| `artifact` | Notebook outline, script, or table/chart description |
| `risks` | Bias, leakage, PII |

## Steps

### Step 1 — `frame-eda`

- **Type:** skill
- **Skill:** `data-analysis-pro`
- **Input:** `data_path`, `question`, `constraints`
- **Output:** `plan` — [references/eda-and-cleaning.md](../../skills/data-analysis-pro/references/eda-and-cleaning.md)

### Step 2 — `viz-or-spreadsheet`

- **Type:** skill
- **Skill:** `data-analysis-pro`
- **Input:** `plan` + data
- **Output:** `artifact` — [references/visualization-and-communication.md](../../skills/data-analysis-pro/references/visualization-and-communication.md) or [references/spreadsheets-charts-and-validation.md](../../skills/data-analysis-pro/references/spreadsheets-charts-and-validation.md)

### Step 3 — `risks-and-handoff`

- **Type:** skill
- **Skill:** `data-analysis-pro` (+ **`business-analysis-pro`** if KPI/requirements)
- **Input:** `artifact`
- **Output:** `risks` — [references/edge-cases.md](../../skills/data-analysis-pro/references/edge-cases.md); use **`content-analysis-pro`** only if the primary input was **PDF/image** narrative, not tabular
