# Workflow: implement-security-review

Threat model, hardening checklist, and review notes for a feature or system using skill **`security-pro`**, combined with stack **`*-pro`** skills for implementation detail.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-security-review` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `scope` | Yes | Surface (web, API, mobile, batch), data sensitivity, deployment (internet-facing, internal), multi-tenancy |
| `stack` | No | Frameworks in use (maps to `nestjs-pro`, `nextjs-pro`, `postgresql-pro`, …) |

## Outputs

| Variable | Description |
|----------|-------------|
| `threat_model` | Trust boundaries, assets, STRIDE-style notes |
| `recommendations` | Controls, priority, which skill owns wiring |
| `residual_risks` | Gaps, verification (tests, pen-test), process |

## Steps

### Step 1 — `scope-and-model`

- **Type:** skill
- **Skill:** `security-pro`
- **Input:** Normalize `scope` and `stack`; identify Related skills table rows.
- **Output:** `threat_model` — follow [references/fundamentals-and-threat-model.md](../../skills/security-pro/references/fundamentals-and-threat-model.md)

### Step 2 — `hardening-and-patterns`

- **Type:** skill
- **Skill:** `security-pro`
- **Input:** `threat_model` + `scope`
- **Output:** `recommendations` — use [references/tips-and-tricks.md](../../skills/security-pro/references/tips-and-tricks.md), [references/osi-and-networking.md](../../skills/security-pro/references/osi-and-networking.md), and [references/attack-techniques-and-methods.md](../../skills/security-pro/references/attack-techniques-and-methods.md) when relevant; defer API/framework steps to **`nestjs-pro`** / **`nextjs-pro`** / **`postgresql-pro`** / **`react-pro`** / **`flutter-pro`** / **`react-native-pro`** as applicable; use **`testing-pro`** for abuse-case tests and CI gates; for self-assessment programs use [references/offensive-simulation-and-self-assessment.md](../../skills/security-pro/references/offensive-simulation-and-self-assessment.md)

### Step 3 — `edge-cases-and-residual`

- **Type:** skill
- **Skill:** `security-pro`
- **Input:** proposed design or PR diff
- **Output:** `residual_risks` — check [references/edge-cases.md](../../skills/security-pro/references/edge-cases.md) and checklist in [`SKILL.md`](../../skills/security-pro/SKILL.md)
