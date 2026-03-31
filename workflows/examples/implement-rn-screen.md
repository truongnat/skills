# Workflow: implement-rn-screen

Implement a React Native / Expo screen from spec through review (UI/UX + edge cases), using skill **`react-native-pro`**.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-rn-screen` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `screen_spec` | Yes | UI, flow, data (Markdown or bullets) |
| `stack` | No | e.g. Expo SDK 51, React Navigation 6, if known |

## Outputs

| Variable | Description |
|----------|-------------|
| `implementation` | Suggested code / diff + checklist addressed |
| `review_notes` | Remaining risks (devices, native) |

## Steps

### Step 1 — `spec-to-plan`

- **Type:** skill
- **Skill:** `react-native-pro`
- **Input:** Normalize spec: layout, loading/empty/error, navigation, async data. Note iOS vs Android differences if any.
- **Output:** `plan` (component structure, hooks, files to add/edit)

### Step 2 — `implement`

- **Type:** skill
- **Skill:** `react-native-pro`
- **Input:** `plan` + `screen_spec`
- **Output:** `code` — follow [references/ui-ux-design.md](../../skills/react-native-pro/references/ui-ux-design.md) and [references/tips-and-tricks.md](../../skills/react-native-pro/references/tips-and-tricks.md)

### Step 3 — `edge-and-a11y-review`

- **Type:** skill
- **Skill:** `react-native-pro`
- **Input:** `code`
- **Output:** `review_notes` — check [references/edge-cases.md](../../skills/react-native-pro/references/edge-cases.md) and the checklist in `SKILL.md` (keyboard, SafeArea, back, lists)
