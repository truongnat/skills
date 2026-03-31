# Workflow: implement-web-research

Answer a technical question using **`web-research-pro`**, optionally priming with local **`repo-tooling-pro`** / **`query_kb_batch`** when **`knowledge-base`** is built.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-web-research` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `question` | Yes | What must be verified (API behavior, version, doc fact) |
| `product` | No | Library or vendor name |
| `version` | No | Runtime or doc generation target |

## Outputs

| Variable | Description |
|----------|-------------|
| `sources` | Ordered list (official first) |
| `answer` | Synthesis with citations |
| `caveats` | Staleness, single-source risk |

## Steps

### Step 1 — `local-kb-optional`

- **Type:** skill
- **Skill:** `repo-tooling-pro`
- **Input:** `question`
- **Output:** If `knowledge-base/embeddings` exist — run **`query_kb.py`** or **`query_kb_batch.py`** per [scripts/README.md](../../scripts/README.md); else skip

### Step 2 — `research-and-evaluate`

- **Type:** skill
- **Skill:** `web-research-pro`
- **Input:** `question`, `product`, `version`
- **Output:** `sources`, `answer` — [references/workflow-sources-and-evaluation.md](../../skills/web-research-pro/references/workflow-sources-and-evaluation.md)

### Step 3 — `citations-and-stale`

- **Type:** skill
- **Skill:** `web-research-pro`
- **Input:** draft `answer`
- **Output:** `caveats` — [references/citations-and-stale-urls.md](../../skills/web-research-pro/references/citations-and-stale-urls.md)
