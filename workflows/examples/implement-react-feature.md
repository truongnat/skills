# Workflow: implement-react-feature

Implement a React (web) feature: components, hooks, data fetching — from spec through review (a11y + SSR/hydration), using skill **`react-pro`**.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-react-feature` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `feature_spec` | Yes | UI, state, routing, data (Markdown or bullets) |
| `stack` | No | Vite/Next/Remix, React major, styling stack |

## Outputs

| Variable | Description |
|----------|-------------|
| `implementation` | Suggested components + hooks + checklist |
| `review_notes` | Risks (hydration, effects, a11y) |

## Steps

### Step 1 — `spec-to-plan`

- **Type:** skill
- **Skill:** `react-pro`
- **Input:** Normalize `feature_spec`: component tree, state ownership, SSR/RSC boundaries if any.
- **Output:** `plan` (files, hooks, boundaries)

### Step 2 — `implement`

- **Type:** skill
- **Skill:** `react-pro`
- **Input:** `plan` + `feature_spec`
- **Output:** `code` — follow [references/components-and-jsx.md](../../skills/public/react-pro/references/components-and-jsx.md), [references/ui-ux-design.md](../../skills/public/react-pro/references/ui-ux-design.md), [references/tips-and-tricks.md](../../skills/public/react-pro/references/tips-and-tricks.md)

### Step 3 — `edge-and-a11y-review`

- **Type:** skill
- **Skill:** `react-pro`
- **Input:** `code`
- **Output:** `review_notes` — check [references/edge-cases.md](../../skills/public/react-pro/references/edge-cases.md) and the checklist in `SKILL.md`
