# Workflow: implement-react-feature

Triển khai feature React (web): component, hooks, data fetching, từ spec đến review (a11y + SSR/hydration), tham chiếu skill **`react-pro`**.

## Metadata

| Thuộc tính | Giá trị |
|------------|---------|
| **id** | `implement-react-feature` |
| **version** | 1.0 |

## Đầu vào

| Biến | Bắt buộc | Mô tả |
|------|----------|--------|
| `feature_spec` | Có | UI, state, routing, data (Markdown hoặc bullet) |
| `stack` | Không | Vite/Next/Remix, React major, styling stack |

## Đầu ra

| Biến | Mô tả |
|------|--------|
| `implementation` | Component + hooks gợi ý + checklist |
| `review_notes` | Rủi ro (hydration, effects, a11y) |

## Các bước

### Bước 1 — `spec-to-plan`

- **Loại:** skill
- **Skill:** `react-pro`
- **Đầu vào:** Chuẩn hóa `feature_spec`: component tree, state ownership, SSR/RSC boundaries nếu có.
- **Đầu ra:** `plan` (file, hooks, boundaries)

### Bước 2 — `implement`

- **Loại:** skill
- **Skill:** `react-pro`
- **Đầu vào:** `plan` + `feature_spec`
- **Đầu ra:** `code` — theo [references/components-and-jsx.md](../../skills/public/react-pro/references/components-and-jsx.md), [references/ui-ux-design.md](../../skills/public/react-pro/references/ui-ux-design.md), [references/tips-and-tricks.md](../../skills/public/react-pro/references/tips-and-tricks.md)

### Bước 3 — `edge-and-a11y-review`

- **Loại:** skill
- **Skill:** `react-pro`
- **Đầu vào:** `code`
- **Đầu ra:** `review_notes` — đối chiếu [references/edge-cases.md](../../skills/public/react-pro/references/edge-cases.md) và checklist trong `SKILL.md`
