# Cấu hình (ví dụ)

Sao chép file này thành `config.md` và chỉnh giá trị. `config.md` có thể thêm vào `.gitignore` nếu chứa đường dẫn nhạy cảm.

## Knowledge base (cho `scripts/build_kb.py` và `scripts/query_kb.py`)

Các script chỉ đọc khối **machine-readable** dưới đây (giữ nguyên hai dòng comment đánh dấu).

<!-- kb-config-start -->
documents_path = knowledge-base/documents
embedding_model = sentence-transformers/all-MiniLM-L6-v2
embeddings_path = knowledge-base/embeddings/rag_embeddings.npy
manifest_path = knowledge-base/embeddings/rag_manifest.json
chunk_size = 1000
chunk_overlap = 200
<!-- kb-config-end -->

## Ghi chú

- `documents_path`: thư mục gốc chứa file `.md` để index.
- `embedding_model`: tên model Hugging Face / sentence-transformers.
- `embeddings_path` / `manifest_path`: file sinh ra sau khi chạy build (đã gitignore).
- `chunk_size` / `chunk_overlap`: độ dài chunk khi cắt tài liệu.

## Dự án (tham khảo — không bắt buộc cho scripts)

| Thuộc tính | Giá trị ví dụ |
|------------|----------------|
| Tên repo | own-skills |
| Phiên bản | 1.0.0 |
