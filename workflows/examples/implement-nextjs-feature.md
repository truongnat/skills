# Workflow: implement-nextjs-feature

Implement a Next.js feature (App Router: page, layout, data, Server Action / Route Handler) from spec through review (RSC boundary + caching), using **`nextjs-pro`** and **`react-pro`** for plain React parts.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-nextjs-feature` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `feature_spec` | Yes | Route, UI, data, auth (Markdown or bullets) |
| `stack` | No | Next major, App vs Pages, deploy (Vercel/self-host) |

## Outputs

| Variable | Description |
|----------|-------------|
| `implementation` | Suggested `app/...` files + snippets + checklist |
| `review_notes` | Caching, RSC, middleware risks |

## Steps

### Step 1 — `spec-to-plan`

- **Type:** skill
- **Skill:** `nextjs-pro`
- **Input:** Normalize `feature_spec`: segment tree, server vs client, cache/revalidate, middleware.
- **Output:** `plan` (file paths, boundaries)

### Step 2 — `implement`

- **Type:** skill
- **Skill:** `nextjs-pro` (+ `react-pro` for pure client components)
- **Input:** `plan` + `feature_spec`
- **Output:** `code` — follow [references/app-router-and-layouts.md](../../skills/public/nextjs-pro/references/app-router-and-layouts.md), [references/server-client-boundaries.md](../../skills/public/nextjs-pro/references/server-client-boundaries.md), [references/tips-and-tricks.md](../../skills/public/nextjs-pro/references/tips-and-tricks.md)

### Step 3 — `edge-and-cache-review`

- **Type:** skill
- **Skill:** `nextjs-pro`
- **Input:** `code`
- **Output:** `review_notes` — check [references/edge-cases.md](../../skills/public/nextjs-pro/references/edge-cases.md) and the checklist in `SKILL.md`
