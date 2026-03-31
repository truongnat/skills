# Workflow: implement-seo-program

Run the **SEO lifecycle** (baseline, audit, strategy, implementation hooks, measurement) using skill **`seo-pro`**, with implementation routed to **`nextjs-pro`** / **`react-pro`** / **`deployment-pro`** as needed.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-seo-program` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `goals` | Yes | Organic KPIs (traffic, leads, key queries/markets) |
| `stack` | Yes | e.g. Next.js, SPA React, static site |
| `locale` | No | Countries/languages, domain strategy |

## Outputs

| Variable | Description |
|----------|-------------|
| `baseline` | Current GSC/analytics snapshot and gaps |
| `plan` | Prioritized technical + content actions |
| `measurement` | Metrics and review cadence |

## Steps

### Step 1 — `baseline-and-audit`

- **Type:** skill
- **Skill:** `seo-pro`
- **Input:** `goals`, `stack`, `locale`
- **Output:** `baseline` — follow [references/seo-flow-and-lifecycle.md](../../skills/seo-pro/references/seo-flow-and-lifecycle.md) and [references/technical-seo-and-crawl.md](../../skills/seo-pro/references/technical-seo-and-crawl.md)

### Step 2 — `strategy-and-implementation-handoff`

- **Type:** skill
- **Skill:** `seo-pro` + **`nextjs-pro`** and/or **`react-pro`**
- **Input:** `baseline`
- **Output:** `plan` — on-page and internal linking from [references/tips-and-tricks.md](../../skills/seo-pro/references/tips-and-tricks.md); routing/metadata/sitemap implementation via **`nextjs-pro`** when App Router; **`deployment-pro`** if TTFB/CDN/caching dominates CWV

### Step 3 — `measure-and-edge-review`

- **Type:** skill
- **Skill:** `seo-pro`
- **Input:** post-ship URLs or release date
- **Output:** `measurement` — GSC segments, CWV field data expectations; review [references/edge-cases.md](../../skills/seo-pro/references/edge-cases.md); checklist in [`SKILL.md`](../../skills/seo-pro/SKILL.md)
