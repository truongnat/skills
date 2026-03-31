# Workflow: implement-deployment-pipeline

Design or refine a **deployment path** (build, publish, promote, observe, rollback) using skill **`deployment-pro`**, with clear handoffs to **`testing-pro`**, **`security-pro`**, and stack skills as needed.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-deployment-pipeline` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `runtime` | Yes | Static, PaaS, containers (K8s), serverless, VM, hybrid |
| `environments` | Yes | e.g. dev, staging, prod — promotion rules |
| `constraints` | No | Downtime budget, regions, compliance, cost |

## Outputs

| Variable | Description |
|----------|-------------|
| `method` | Chosen hosting / deploy model and rationale |
| `pipeline` | CI/CD stages, gates, artifacts |
| `release` | Strategy (rolling, canary, blue-green, flags) |
| `risks` | Rollback, migrations, observability gaps |

## Steps

### Step 1 — `method-and-env`

- **Type:** skill
- **Skill:** `deployment-pro`
- **Input:** `runtime`, `environments`, `constraints`
- **Output:** `method` — follow [references/methods-and-environments.md](../../skills/deployment-pro/references/methods-and-environments.md)

### Step 2 — `flow-and-quality-gates`

- **Type:** skill
- **Skill:** `deployment-pro` + **`testing-pro`**
- **Input:** `method` + existing test posture
- **Output:** `pipeline` — [references/flows-and-pipelines.md](../../skills/deployment-pro/references/flows-and-pipelines.md) for stages; **`testing-pro`** for what runs before merge and before prod (lint, unit, integration, e2e policy)

### Step 3 — `release-and-residual`

- **Type:** skill
- **Skill:** `deployment-pro` (+ **`postgresql-pro`** if migrations; **`security-pro`** for secrets/OIDC)
- **Input:** proposed pipeline YAML / IaC
- **Output:** `release` + `risks` — [references/tips-and-tricks.md](../../skills/deployment-pro/references/tips-and-tricks.md), [references/edge-cases.md](../../skills/deployment-pro/references/edge-cases.md); checklist in [`SKILL.md`](../../skills/deployment-pro/SKILL.md)
