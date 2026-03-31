# Workflow: implement-flutter-screen

Implement a Flutter screen / flow from spec through review (UI/UX + cross-platform edge cases), using skill **`flutter-pro`**.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-flutter-screen` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `screen_spec` | Yes | UI, state, navigation, platform targets (mobile/web/desktop) |
| `stack` | No | Flutter SDK, state package (Riverpod/Bloc/…), router |

## Outputs

| Variable | Description |
|----------|-------------|
| `implementation` | Suggested widget tree + state + checklist |
| `review_notes` | Risks (async context, platform, a11y) |

## Steps

### Step 1 — `spec-to-plan`

- **Type:** skill
- **Skill:** `flutter-pro`
- **Input:** Normalize `screen_spec`: theme, responsive breakpoints, loading/error/empty, navigation.
- **Output:** `plan` (widget breakdown, state ownership, files)

### Step 2 — `implement`

- **Type:** skill
- **Skill:** `flutter-pro`
- **Input:** `plan` + `screen_spec`
- **Output:** `code` — follow [references/widgets.md](../../skills/public/flutter-pro/references/widgets.md), [references/ui-ux-design.md](../../skills/public/flutter-pro/references/ui-ux-design.md), [references/tips-and-tricks.md](../../skills/public/flutter-pro/references/tips-and-tricks.md)

### Step 3 — `edge-and-a11y-review`

- **Type:** skill
- **Skill:** `flutter-pro`
- **Input:** `code`
- **Output:** `review_notes` — check [references/edge-cases.md](../../skills/public/flutter-pro/references/edge-cases.md) and the checklist in `SKILL.md`
