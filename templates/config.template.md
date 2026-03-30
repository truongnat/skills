# Cấu hình — mẫu (Markdown)

Đây là bản mẫu tương đương [config.example.md](../config.example.md) tại root repo. **Nguồn đúng** để chạy script là `config.md` hoặc `config.example.md` ở thư mục gốc project.

Sao chép nội dung cần thiết vào `config.md` tại root (hoặc chỉnh trực tiếp `config.example.md` khi fork template).

---

## Knowledge base (khối cho scripts)

Giữ hai dòng comment `kb-config-start` / `kb-config-end`; scripts `build_kb.py` và `query_kb.py` chỉ đọc phần này.

<!-- kb-config-start -->
documents_path = knowledge-base/documents
embedding_model = sentence-transformers/all-MiniLM-L6-v2
embeddings_path = knowledge-base/embeddings/rag_embeddings.npy
manifest_path = knowledge-base/embeddings/rag_manifest.json
chunk_size = 1000
chunk_overlap = 200
<!-- kb-config-end -->

## Mở rộng

Các tùy chọn khác (API keys, MCP, logging, …) có thể ghi thêm **bằng Markdown** trong cùng file (bảng, mục) — scripts hiện tại không đọc các mục đó; chỉ dùng cho tài liệu người hoặc tooling tương lai.
