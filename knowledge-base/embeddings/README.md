# embeddings (generated)

Thư mục này chứa **chỉ số RAG cục bộ** do `scripts/build_kb.py` tạo:

- `rag_embeddings.npy` — ma trận vector (NumPy)
- `rag_manifest.json` — metadata + nội dung từng chunk
- `.cache/` — cache Hugging Face / model (nếu có)

Không chỉnh sửa thủ công. Các file tạo bởi build đã nằm trong `.gitignore` ở root repo.
