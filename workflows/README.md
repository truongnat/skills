# Workflows

Workflow là **hợp đồng Markdown** (file `.md`) mô tả chuỗi bước: mỗi bước gọi một **skill** (theo `name` trong `SKILL.md`) hoặc tham chiếu **mẫu prompt** trong `prompts/` / [templates/PROMPT_TEMPLATES.md](../templates/PROMPT_TEMPLATES.md).

Repo này **không** bắt buộc có engine chạy tự động: agent (hoặc bạn) đọc file và thực hiện tuần tự; sau này có thể thêm runner riêng nếu cần.

## Quy ước (Markdown)

Mỗi workflow nên có:

1. **Tiêu đề** `# Workflow: <id>`
2. **Bảng hoặc danh sách metadata** — `id`, `name`, `version`
3. **Mục Đầu vào / Đầu ra** — bảng biến
4. **Mục Các bước** — mỗi bước là `###` với:
   - Loại: `skill` hoặc mẫu prompt / tài liệu
   - Tên skill hoặc id mẫu
   - Input/output (có thể tham chiếu biến bằng `` `topic` ``)

## Ví dụ (rút gọn)

```markdown
# Workflow: my-flow

## Metadata
| Thuộc tính | Giá trị |
|------------|---------|
| **id** | `my-flow` |
| **version** | 1.0 |

## Đầu vào
| Biến | Bắt buộc |
|------|----------|
| `topic` | Có |

## Các bước
### Bước 1 — collect
- **Loại:** skill
- **Skill:** `my-skill`
- **Đầu vào:** `query` = `topic`
```

## Thư mục

- `examples/` — workflow mẫu để nhân bản (`.md`).
