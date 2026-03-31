# Workflow: implement-design-system

Establish or extend a **design baseline** (tokens, patterns, documentation) and align **web / app / desktop** surfaces using skill **`design-system-pro`**, with implementation routed to framework skills.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-design-system` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `product` | Yes | Marketing vs app vs admin/analytics; primary platforms |
| `constraints` | No | Brand, accessibility tier, existing library (MUI, Radix, …) |

## Outputs

| Variable | Description |
|----------|-------------|
| `baseline` | Tokens + a11y targets + data density stance |
| `guidelines` | Components/patterns and governance rules |
| `handoff` | What engineering implements in which repo |

## Steps

### Step 1 — `baseline-and-foundations`

- **Type:** skill
- **Skill:** `design-system-pro`
- **Input:** `product`, `constraints`
- **Output:** `baseline` — [references/foundations-baseline-and-data-ui.md](../../skills/design-system-pro/references/foundations-baseline-and-data-ui.md)

### Step 2 — `system-and-consistency`

- **Type:** skill
- **Skill:** `design-system-pro`
- **Input:** `baseline`
- **Output:** `guidelines` — [references/design-system-guidelines-and-consistency.md](../../skills/design-system-pro/references/design-system-guidelines-and-consistency.md); [references/platforms-web-app-desktop.md](../../skills/design-system-pro/references/platforms-web-app-desktop.md) for per-surface rules

### Step 3 — `themes-handoff-and-edge`

- **Type:** skill
- **Skill:** `design-system-pro` + **`react-pro`** / **`nextjs-pro`** / **`flutter-pro`** / …
- **Input:** `guidelines` + target codebase
- **Output:** `handoff` — [references/trends-themes-and-visual-language.md](../../skills/design-system-pro/references/trends-themes-and-visual-language.md), [references/tips-and-tricks.md](../../skills/design-system-pro/references/tips-and-tricks.md), [references/edge-cases.md](../../skills/design-system-pro/references/edge-cases.md); implementation in code per framework skill; optional **`testing-pro`** for visual regression
