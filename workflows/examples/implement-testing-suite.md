# Workflow: implement-testing-suite

Design or extend a **test strategy** and **automation** (CI, unit/integration/e2e) from spec through review, using skill **`testing-pro`**.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-testing-suite` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `test_spec` | Yes | Stack (language, framework), what to cover (features, APIs, journeys), constraints (CI minutes, no staging DB, etc.) |
| `stack` | No | Runners already in repo (Jest, Playwright, pytest, …), CI platform |

## Outputs

| Variable | Description |
|----------|-------------|
| `plan` | Test layers, folder layout, CI stages |
| `implementation` | Suggested tests + CI snippets + checklist |
| `review_notes` | Flakiness risks, coverage gaps, maintenance cost |

## Steps

### Step 1 — `spec-to-plan`

- **Type:** skill
- **Skill:** `testing-pro`
- **Input:** Normalize `test_spec`: risk areas, existing coverage, must-not-break flows, automation budget.
- **Output:** `plan` (unit vs integration vs e2e split, tools, CI order)

### Step 2 — `implement`

- **Type:** skill
- **Skill:** `testing-pro`
- **Input:** `plan` + `test_spec`
- **Output:** `implementation` — follow [references/test-pyramid-and-strategy.md](../../skills/testing-pro/references/test-pyramid-and-strategy.md), [references/automation-and-ci.md](../../skills/testing-pro/references/automation-and-ci.md), [references/tips-and-tricks.md](../../skills/testing-pro/references/tips-and-tricks.md); combine with **`react-pro`** / **`nextjs-pro`** / **`nestjs-pro`** / **`flutter-pro`** / **`react-native-pro`** / **`postgresql-pro`** when tests are stack-specific

### Step 3 — `edge-and-flake-review`

- **Type:** skill
- **Skill:** `testing-pro`
- **Input:** proposed tests / CI YAML
- **Output:** `review_notes` — check [references/edge-cases.md](../../skills/testing-pro/references/edge-cases.md) and checklist in `SKILL.md`
