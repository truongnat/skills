# Knowledge base

Tài liệu nguồn (Markdown) dùng cho tra cứu thủ công, agent đọc theo [INDEX.md](INDEX.md), hoặc **RAG** qua `scripts/build_kb.py` / `scripts/query_kb.py`.

## Quy ước

1. **Đặt file** theo chủ đề: `documents/<domain>/<tên-file>.md` (chữ thường, gạch ngang).
2. **Đầu mỗi file** có thể thêm mục siêu dữ liệu bằng Markdown (bảng hoặc danh sách), ví dụ:

| Thuộc tính | Giá trị |
|------------|---------|
| title | Tiêu đề hiển thị |
| summary | Một dòng mô tả |
| tags | tag1, tag2 |
| updated | 2026-03-30 |

3. **Cập nhật [INDEX.md](INDEX.md)** mỗi khi thêm/sửa tài liệu quan trọng (topic → đường dẫn → mô tả ngắn).
4. **Không** commit vector/index vào git — xem `.gitignore` ở root; `embeddings/` chứa `rag_embeddings.npy` và `rag_manifest.json` do `scripts/build_kb.py` tạo.

## Thư mục

| Đường dẫn | Nội dung |
|-----------|----------|
| `documents/` | Markdown nguồn sự thật (policies, runbooks, product, …) |
| `embeddings/` | Index RAG cục bộ `.npy` + `.json` (generated — đã ignore) |
