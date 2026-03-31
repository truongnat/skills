# Workflow: implement-nextjs-feature

Triển khai feature Next.js (App Router: page, layout, data, Server Action / Route Handler) từ spec đến review (RSC boundary + caching), tham chiếu skill **`nextjs-pro`** và **`react-pro`** cho phần React thuần.

## Metadata

| Thuộc tính | Giá trị |
|------------|---------|
| **id** | `implement-nextjs-feature` |
| **version** | 1.0 |

## Đầu vào

| Biến | Bắt buộc | Mô tả |
|------|----------|--------|
| `feature_spec` | Có | Route, UI, data, auth (Markdown hoặc bullet) |
| `stack` | Không | Next major, App vs Pages, deploy (Vercel/self-host) |

## Đầu ra

| Biến | Mô tả |
|------|--------|
| `implementation` | File `app/...` + snippet gợi ý + checklist |
| `review_notes` | Rủi ro caching, RSC, middleware |

## Các bước

### Bước 1 — `spec-to-plan`

- **Loại:** skill
- **Skill:** `nextjs-pro`
- **Đầu vào:** Chuẩn hóa `feature_spec`: segment tree, server vs client, cache/revalidate, middleware.
- **Đầu ra:** `plan` (đường dẫn file, boundaries)

### Bước 2 — `implement`

- **Loại:** skill
- **Skill:** `nextjs-pro` (+ `react-pro` cho component client thuần)
- **Đầu vào:** `plan` + `feature_spec`
- **Đầu ra:** `code` — theo [references/app-router-and-layouts.md](../../skills/public/nextjs-pro/references/app-router-and-layouts.md), [references/server-client-boundaries.md](../../skills/public/nextjs-pro/references/server-client-boundaries.md), [references/tips-and-tricks.md](../../skills/public/nextjs-pro/references/tips-and-tricks.md)

### Bước 3 — `edge-and-cache-review`

- **Loại:** skill
- **Skill:** `nextjs-pro`
- **Đầu vào:** `code`
- **Đầu ra:** `review_notes` — đối chiếu [references/edge-cases.md](../../skills/public/nextjs-pro/references/edge-cases.md) và checklist trong `SKILL.md`
