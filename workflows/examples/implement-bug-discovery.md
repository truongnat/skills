# Workflow: implement-bug-discovery

Hunt **defects** and **related** breakage using **`bug-discovery-pro`**, GitNexus MCP when the repo is indexed, and **`testing-pro`** for repro and coverage.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-bug-discovery` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `symptom` | Yes | Error, flaky test, or unexpected behavior |
| `repo_state` | No | GitNexus indexed? branch? |

## Outputs

| Variable | Description |
|----------|-------------|
| `candidates` | Ranked defect candidates with confidence |
| `related` | Symbols/routes at risk (impact) |
| `next_steps` | Tests, index refresh, or handoff |

## Steps

### Step 1 — `repro-and-baseline`

- **Type:** skill
- **Skill:** `bug-discovery-pro` + **`testing-pro`**
- **Input:** `symptom`
- **Output:** minimal repro or log baseline — [references/bug-candidates-and-confidence.md](../../skills/bug-discovery-pro/references/bug-candidates-and-confidence.md)

### Step 2 — `graph-assisted-discovery`

- **Type:** skill
- **Skill:** `bug-discovery-pro` (GitNexus MCP if available)
- **Input:** repro target symbol or route
- **Output:** `candidates` + `related` — [references/gitnexus-graph-workflow.md](../../skills/bug-discovery-pro/references/gitnexus-graph-workflow.md); use **`query`**, **`context`**, **`impact`**, **`api_impact`**, **`shape_check`**, **`detect_changes`** per MCP schemas

### Step 3 — `triage-and-handoff`

- **Type:** skill
- **Skill:** `bug-discovery-pro`
- **Input:** graph + code read
- **Output:** `next_steps` — [references/tips-and-tricks.md](../../skills/bug-discovery-pro/references/tips-and-tricks.md), [references/edge-cases.md](../../skills/bug-discovery-pro/references/edge-cases.md); **`security-pro`** if vuln-class; stack **`*-pro`** for fixes
