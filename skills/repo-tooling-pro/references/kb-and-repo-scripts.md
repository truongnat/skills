# KB scripts and repo helpers (performance)

Scripts live under **`scripts/`** at the **repository root** (not inside each skill folder). See [`scripts/README.md`](../../../scripts/README.md).

## Why batch query matters

`query_kb.py` loads **`SentenceTransformer`** on every invocation. For **many** questions (exploration, golden tests), use **`query_kb_batch.py`** — **one** model load, batch encode, then rank per query. Typical speedup: **N queries** ≈ **1×** load + **N×** small matmul instead of **N×** full startup.

## Inventory and CI

| Script | Role |
|--------|------|
| **`list_skills.py`** | Prints bundled `skills/*/SKILL.md` rows; `--json` for agents. |
| **`validate_skills.py`** | Ensures `name:` in frontmatter matches folder name; use in **CI** before merge. |
| **`analyze_skills.py`** | Heuristic **report** (tiers: strong / consider / low): skills that imply automation (FFmpeg, CI, shell, …) vs those that already reference `scripts/` or **`repo-tooling-pro`**. Use **`--with-references`** for fuller signals; **`--only-actionable`** to shrink output. Not a linter — for **authoring** and **self-support script** decisions. |

## KB pipeline

1. Edit `knowledge-base/documents/**/*.md`
2. `python scripts/build_kb.py`
3. `python scripts/verify_kb.py`
4. Single probe: `query_kb.py` — or batch: `query_kb_batch.py`

## Dependencies

Same as `requirements.txt` (NumPy, sentence-transformers). No extra packages for `list_skills` / `validate_skills`.
