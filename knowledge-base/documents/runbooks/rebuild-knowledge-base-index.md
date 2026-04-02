| Field | Value |
|-------|-------|
| title | Rebuild knowledge base index |
| summary | Operational steps to (re)build embeddings and verify the local RAG pipeline for this repo |
| tags | runbook, knowledge-base, scripts, embeddings |
| updated | 2026-04-02 |
| status | active |

# Runbook: rebuild knowledge base index

## When to use

- After **adding, renaming, or removing** files under `knowledge-base/documents/`.
- After changing **`kb-config`** in `config.md` or `config.example.md` (paths, chunk size, model).
- When **`query-kb`** fails, embeddings look **stale**, or **`verify-kb`** reports desync.
- On a **new machine** or CI agent that needs a local index.

## Prerequisites

- **Node.js** (LTS) and **npm** — see root `README.md`.
- Repo root as current directory.
- Dependencies and build:

```bash
npm install
npm run build
```

- Optional: copy `config.example.md` to `config.md` and adjust the `<!-- kb-config -->` block if paths or model must differ from defaults.

## Steps

### 1. Dry run (optional but recommended)

```bash
node dist/tools.js build-kb --dry-run
```

Confirm listed files and chunk counts match expectations. Fix path or config issues before a full encode.

### 2. Full build

```bash
node dist/tools.js build-kb
```

**Note:** First run may **download** the embedding model (network, disk, RAM). Subsequent runs reuse the cache where possible.

### 3. Verify invariants

```bash
node dist/tools.js verify-kb
```

Address any errors (missing manifest, row count mismatch, missing `kb-config`). See [`VERIFY.md`](../../VERIFY.md) for meaning of checks.

### 4. Smoke query

```bash
node dist/tools.js query-kb "skills directory layout" -k 3
```

Exit code **0** and plausible top chunks indicate the pipeline works. Retrieval **quality** is not guaranteed by this step alone (see `VERIFY.md` §2).

## Rollback / recovery

- **Bad or partial index:** delete outputs under `knowledge-base/embeddings/` (if present), then rerun **Steps 2–4**. Git ignores generated artifacts; rebuilding is safe if source docs are intact.
- **Wrong document in results:** improve chunking, query wording, or add golden tests per `VERIFY.md`; not a rollback of embeddings alone.

## Related documents

- [`VERIFY.md`](../../VERIFY.md) — what “verified” means.
- [`config.example.md`](../../../config.example.md) — configuration block reference.
- [`scripts/README.md`](../../../scripts/README.md) — full CLI map.

## Escalation

- Script errors (tracebacks): check Node version and `npm install`; open an issue with command, OS, and log.
- Model download blocked: set mirror or use an allowed Hugging Face cache path in the environment (team policy).
