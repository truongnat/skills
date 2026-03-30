# Workflow: research-synthesize

Định dạng workflow trong repo này là **Markdown**: mô tả đầu vào/đầu ra và từng bước bằng tiêu đề và danh sách. Agent (hoặc bạn) đọc file và thực hiện tuần tự — không cần engine YAML.

## Metadata

| Thuộc tính | Giá trị |
|------------|---------|
| **id** | `research-synthesize` |
| **name** | Nghiên cứu rồi tóm tắt |
| **version** | 1.0 |

## Mô tả

Luồng minh họa: bước 1 thu thập/ngữ cảnh, bước 2 tổng hợp. Thay tên skill và mẫu prompt bằng skill/prompt thật trong repo của bạn.

## Đầu vào

| Biến | Kiểu | Bắt buộc | Mô tả |
|------|------|----------|--------|
| `topic` | string | Có | Chủ đề cần làm rõ |

## Đầu ra

| Biến | Kiểu | Mô tả |
|------|------|--------|
| `summary` | markdown | Bản tóm tắt cuối |

## Các bước

### Bước 1 — `gather-context`

- **Loại:** skill
- **Skill:** `skill-template` (đổi thành skill thật, ví dụ tra knowledge-base, đọc `knowledge-base/INDEX.md`)
- **Đầu vào:** `query` = nội dung chủ đề từ biến `topic`
- **Đầu ra:** `gather_notes`

### Bước 2 — `synthesize`

- **Loại:** mẫu prompt (tham chiếu theo id trong [templates/PROMPT_TEMPLATES.md](../../templates/PROMPT_TEMPLATES.md))
- **Mẫu:** `code-review-comprehensive` — chỉ là ví dụ; đổi sang mẫu phù hợp tóm tắt
- **Đầu vào:** nội dung từ `gather_notes` (trong mẫu có thể map vào biến như `code` hoặc đổi sang section “nội dung nguồn”)
- **Ngôn ngữ nội dung:** markdown
- **Đầu ra:** `final_summary`
