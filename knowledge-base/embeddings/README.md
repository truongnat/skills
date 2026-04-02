# embeddings (generated)

This directory holds the **local RAG index** produced by **`node dist/tools.js build-kb`**:

- `rag_embeddings.npy` — NumPy vector matrix
- `rag_manifest.json` — metadata + chunk text
- `.cache/` — Hugging Face / model cache (if present)

Do not edit by hand. Generated artifacts are listed in the root `.gitignore`.
