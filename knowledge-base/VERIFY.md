# How to verify the knowledge base and scripts

You cannot prove **100% correctness** of *semantic search quality* without defining expected answers (golden tests). You **can** prove **100%** that the **pipeline is wired correctly**: config loads, files are indexed, embeddings match the manifest, and queries run without errors.

## 1. Automated checks (recommended)

```bash
# From repo root — npm install + npm run build if dist/ is missing

# List files and chunk counts (dry-run skips full encode)
node dist/tools.js build-kb --dry-run

# Build or rebuild index
node dist/tools.js build-kb

# Verify invariants + optional retrieval smoke test
node dist/tools.js verify-kb

# Manual query
node dist/tools.js query-kb "skills directory" -k 3
```

**What `verify-kb` checks**

| Check | Meaning |
|-------|--------|
| `config.md` / `config.example.md` has `kb-config` block | Parser works |
| At least one `.md` under `documents_path` | Nothing to index otherwise |
| If index files exist: row count = manifest length | No desync after partial writes |
| Embedding matrix is 2-D, reasonable dtype | `numpy` load OK |
| Every manifest row has `id` | JSON integrity |
| Optional: smoke query; warns if top doc is unexpected | Heuristic only |

## 2. What “100% working” means in practice

- **Structural / mechanical correctness:** use `verify-kb` + successful `build-kb` + `query-kb` exit code 0. This is as close to “100%” as you get for plumbing.
- **Retrieval quality** (right chunk for a question): requires **golden tests** — store `(query, expected_source_path)` pairs and assert the top-k sources contain the expected file. The repo does not ship a large suite; add your own in CI if needed.

## 3. Quick manual checklist

- [ ] `node dist/tools.js build-kb --dry-run` shows expected file count and chunk count
- [ ] After `build-kb`, `rag_embeddings.npy` and `rag_manifest.json` exist under `knowledge-base/embeddings/`
- [ ] `node dist/tools.js verify-kb` exits 0
- [ ] `query-kb` with a phrase from *your* doc returns that doc in top-k (spot-check)

## 4. If something fails

| Symptom | Likely cause |
|---------|----------------|
| `No kb-config block` | Missing `<!-- kb-config-start/end -->` in `config.md` |
| `Index not found` | Run `build-kb` first |
| `Manifest length does not match` | Re-run `build-kb` (crash mid-write) |
| `UnicodeEncodeError` on Windows | Use UTF-8 terminal; CLI uses UTF-8 output where applicable |
| Wrong top search result | Normal for small corpus; tune chunks, model, or add more docs |
