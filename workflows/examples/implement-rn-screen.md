# Workflow: implement-rn-screen

Triển khai một màn hình React Native / Expo từ spec đến review (UI/UX + edge cases), tham chiếu skill **`react-native-pro`**.

## Metadata

| Thuộc tính | Giá trị |
|------------|---------|
| **id** | `implement-rn-screen` |
| **version** | 1.0 |

## Đầu vào

| Biến | Bắt buộc | Mô tả |
|------|----------|--------|
| `screen_spec` | Có | Mô tả UI, luồng, dữ liệu (Markdown hoặc bullet) |
| `stack` | Không | Ví dụ: Expo SDK 51, React Navigation 6, v.v. nếu biết |

## Đầu ra

| Biến | Mô tả |
|------|--------|
| `implementation` | Code / diff gợi ý + checklist đã xử lý |
| `review_notes` | Rủi ro còn lại (thiết bị, native) |

## Các bước

### Bước 1 — `spec-to-plan`

- **Loại:** skill
- **Skill:** `react-native-pro`
- **Đầu vào:** Chuẩn hóa spec: layout, trạng thái loading/empty/error, navigation, dữ liệu async. Ghi rõ iOS vs Android nếu có khác biệt.
- **Đầu ra:** `plan` (cấu trúc component, hooks, file cần tạo/sửa)

### Bước 2 — `implement`

- **Loại:** skill
- **Skill:** `react-native-pro`
- **Đầu vào:** `plan` + `screen_spec`
- **Đầu ra:** `code` — triển khai theo [references/ui-ux-design.md](../../skills/public/react-native-pro/references/ui-ux-design.md) và [references/tips-and-tricks.md](../../skills/public/react-native-pro/references/tips-and-tricks.md)

### Bước 3 — `edge-and-a11y-review`

- **Loại:** skill
- **Skill:** `react-native-pro`
- **Đầu vào:** `code`
- **Đầu ra:** `review_notes` — đối chiếu [references/edge-cases.md](../../skills/public/react-native-pro/references/edge-cases.md) và checklist trong `SKILL.md` (keyboard, SafeArea, back, lists)
