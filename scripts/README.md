# Scripts (repo tooling)

Python helpers for this **skills template** repo: knowledge base (RAG) and **fast** skill inventory. Requires `pip install -r requirements.txt` from repo root.

## Performance note

| Script | Why use it |
|--------|------------|
| **`query_kb_batch.py`** | Multiple questions with **one** `SentenceTransformer` load. Prefer over N× `query_kb.py` when exploring many queries. |
| **`query_kb.py`** | Single question; simpler CLI. |
| **`build_kb.py`** | (Re)build embeddings after editing `knowledge-base/documents/`. |
| **`verify_kb.py`** | Structural checks + optional smoke query. |
| **`list_skills.py`** | No ML — instant list of `skills/*/SKILL.md` names. |
| **`validate_skills.py`** | CI: `name` in YAML matches folder name. |
| **`analyze_skills.py`** | Heuristic report: automation vs `scripts/`; **`--self-review`** = full repo Markdown (tiers, all skills, checklist); **`--markdown`** / **`--only-actionable`**. See **`skills-self-review-pro`**. |

## Commands

```bash
# From repo root, venv active

# Build / verify KB
python scripts/build_kb.py
python scripts/verify_kb.py

# Single query
python scripts/query_kb.py "your question" -k 5

# Batch (performance): multiple -q or a file of lines
python scripts/query_kb_batch.py -q "skills layout" -q "deployment" -k 3
python scripts/query_kb_batch.py -f queries.txt --json

# Skill inventory
python scripts/list_skills.py
python scripts/list_skills.py --json

# CI validation
python scripts/validate_skills.py

# Skill authoring: automation vs repo scripts (report)
python scripts/analyze_skills.py
python scripts/analyze_skills.py --self-review
python scripts/analyze_skills.py --with-references --only-actionable --markdown
```

## Config

All KB scripts read `<!-- kb-config -->` from `config.md` or `config.example.md` (see `kb_config_md.py`).

## Skill

For agent-oriented guidance on **when** to use these scripts vs skills-only Markdown, see bundled skills **`repo-tooling-pro`** (`skills/repo-tooling-pro/`) and **`skills-self-review-pro`** (`skills/skills-self-review-pro/`) for bundle audits.
