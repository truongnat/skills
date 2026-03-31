# Workflow: implement-mobile-design

Apply **mobile-first UX** rules (touch, safe area, platform patterns) using skill **`mobile-design-pro`**, then hand off to **`react-native-pro`** or **`flutter-pro`** for implementation.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-mobile-design` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `flow` | Yes | User journey (e.g. signup, checkout, reader) |
| `platforms` | Yes | iOS-first, Android-first, or parity |
| `form_factor` | No | Phone only vs tablet / foldable |

## Outputs

| Variable | Description |
|----------|-------------|
| `ux_spec` | Layout and interaction rules |
| `platform_notes` | iOS vs Android deltas |
| `handoff` | What engineering implements in code |

## Steps

### Step 1 — `touch-and-layout`

- **Type:** skill
- **Skill:** `mobile-design-pro`
- **Input:** `flow`, `form_factor`
- **Output:** `ux_spec` — [references/touch-layout-safe-areas-and-density.md](../../skills/mobile-design-pro/references/touch-layout-safe-areas-and-density.md)

### Step 2 — `navigation-and-platforms`

- **Type:** skill
- **Skill:** `mobile-design-pro`
- **Input:** `ux_spec`, `platforms`
- **Output:** `platform_notes` — [references/navigation-and-platform-ios-android.md](../../skills/mobile-design-pro/references/navigation-and-platform-ios-android.md); align tokens with **`design-system-pro`** if needed

### Step 3 — `edge-cases-and-code-handoff`

- **Type:** skill
- **Skill:** `mobile-design-pro` + **`react-native-pro`** or **`flutter-pro`**
- **Input:** `platform_notes`
- **Output:** `handoff` — [references/edge-cases.md](../../skills/mobile-design-pro/references/edge-cases.md), [references/tips-and-tricks.md](../../skills/mobile-design-pro/references/tips-and-tricks.md); screens/components in code per stack skill
