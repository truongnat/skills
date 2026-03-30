# AGENTS — gợi ý cho Cursor / công cụ agent

## Skills

Cursor đọc skill từ thư mục cấu hình (thường là `.cursor/skills` hoặc project rules). Bạn có thể:

- **Copy** một skill từ `skills/public/<tên>/` hoặc `skills/examples/skill-template/` vào thư mục skill mà IDE bạn dùng; hoặc
- **Symlink** (Unix): `ln -s "$(pwd)/skills/public/my-skill" ~/.cursor/skills/my-skill`

Mỗi skill cần file `SKILL.md` với frontmatter `name` và `description` rõ ràng.

## Knowledge base

Agent nên ưu tiên:

1. Đọc `knowledge-base/INDEX.md` để định vị tài liệu.
2. Mở file `.md` trong `knowledge-base/documents/` khi cần chi tiết.
3. Khi cần truy vấn ngữ nghĩa trên toàn bộ corpus đã index, chạy `python scripts/query_kb.py "…"` (sau khi đã `build_kb`).

## Workflows

Đọc file `.md` trong `workflows/examples/` hoặc workflow tự định nghĩa; thực hiện từng bước theo mục **Các bước**.

## Cấu hình

Chỉnh `config.md` (sao chép từ `config.example.md`) — khối `kb-config` trong Markdown, không dùng `.yaml`.
