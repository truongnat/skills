# Workflow: implement-flutter-screen

Triển khai màn hình / flow Flutter từ spec đến review (UI/UX + edge cases đa nền tảng), tham chiếu skill **`flutter-pro`**.

## Metadata

| Thuộc tính | Giá trị |
|------------|---------|
| **id** | `implement-flutter-screen` |
| **version** | 1.0 |

## Đầu vào

| Biến | Bắt buộc | Mô tả |
|------|----------|--------|
| `screen_spec` | Có | UI, state, navigation, platform targets (mobile/web/desktop) |
| `stack` | Không | Flutter SDK, state package (Riverpod/Bloc/…), router |

## Đầu ra

| Biến | Mô tả |
|------|--------|
| `implementation` | Widget tree + state gợi ý + checklist |
| `review_notes` | Rủi ro (async context, platform, a11y) |

## Các bước

### Bước 1 — `spec-to-plan`

- **Loại:** skill
- **Skill:** `flutter-pro`
- **Đầu vào:** Chuẩn hóa `screen_spec`: theme, responsive breakpoints, loading/error/empty, navigation.
- **Đầu ra:** `plan` (widget breakdown, state ownership, files)

### Bước 2 — `implement`

- **Loại:** skill
- **Skill:** `flutter-pro`
- **Đầu vào:** `plan` + `screen_spec`
- **Đầu ra:** `code` — theo [references/widgets.md](../../skills/public/flutter-pro/references/widgets.md), [references/ui-ux-design.md](../../skills/public/flutter-pro/references/ui-ux-design.md) và [references/tips-and-tricks.md](../../skills/public/flutter-pro/references/tips-and-tricks.md)

### Bước 3 — `edge-and-a11y-review`

- **Loại:** skill
- **Skill:** `flutter-pro`
- **Đầu vào:** `code`
- **Đầu ra:** `review_notes` — đối chiếu [references/edge-cases.md](../../skills/public/flutter-pro/references/edge-cases.md) và checklist trong `SKILL.md`
