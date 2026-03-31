# Workflow: implement-business-analysis

Structure a **business problem** into scoped requirements, **reasoned** options, and **report-ready** artifacts using skill **`business-analysis-pro`**, with handoff to **`testing-pro`** / **`security-pro`** as needed.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-business-analysis` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `problem` | Yes | Pain, opportunity, or mandate |
| `audience` | Yes | Sponsor, product, engineering |
| `constraints` | No | Time, budget, compliance, legacy systems |

## Outputs

| Variable | Description |
|----------|-------------|
| `analysis` | Scope, stakeholders, as-is / to-be or gap |
| `requirements` | Prioritized FR/NFR with IDs |
| `report` | Executive summary + detail + appendix outline |

## Steps

### Step 1 — `frame-and-elicit`

- **Type:** skill
- **Skill:** `business-analysis-pro`
- **Input:** `problem`, `constraints`
- **Output:** `analysis` — [references/requirements-and-reasoning.md](../../skills/business-analysis-pro/references/requirements-and-reasoning.md)

### Step 2 — `specify-and-prioritize`

- **Type:** skill
- **Skill:** `business-analysis-pro`
- **Input:** `analysis`, `audience`
- **Output:** `requirements` — MoSCoW, IDs, NFRs; **`testing-pro`** for acceptance criteria draft; **`security-pro`** if data/compliance

### Step 3 — `report-and-handoff`

- **Type:** skill
- **Skill:** `business-analysis-pro`
- **Input:** `requirements`
- **Output:** `report` — [references/reporting-and-deliverables.md](../../skills/business-analysis-pro/references/reporting-and-deliverables.md), [references/tips-and-tricks.md](../../skills/business-analysis-pro/references/tips-and-tricks.md), [references/edge-cases.md](../../skills/business-analysis-pro/references/edge-cases.md); checklist in [`SKILL.md`](../../skills/business-analysis-pro/SKILL.md)
