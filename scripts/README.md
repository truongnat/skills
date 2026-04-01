# Scripts (repo tooling)

Python helpers for this **skills template** repo: knowledge base (RAG) and **fast** skill inventory. Requires `pip install -r requirements.txt` from repo root.

## Install / uninstall into another project

**Primary UX:** use the **`own-skills`** CLI from the repo root **`package.json`** (see root **README**):

```bash
npx github:truongnat/skills
npx --yes github:truongnat/skills -- install --yes --project-dir .
```

The CLI fetches this repository and invokes the bundled **`install.sh`** / **`uninstall.sh`** plus **`install_skill.py`** — you do not need separate curl installers.

**Advanced:** install or uninstall a single skill with **`install_skill.py`** (see examples below). Root **`install.sh`** / **`uninstall.sh`** remain in the repo as the engines the CLI calls; direct use is for maintainers debugging only.

## Performance note

| Script | Why use it |
|--------|------------|
| **`query_kb_batch.py`** | Multiple questions with **one** `SentenceTransformer` load. Prefer over N× `query_kb.py` when exploring many queries. |
| **`query_kb.py`** | Single question; simpler CLI. |
| **`build_kb.py`** | (Re)build embeddings after editing `knowledge-base/documents/`. |
| **`verify_kb.py`** | Structural checks + optional smoke query. |
| **`list_skills.py`** | No ML — instant list of `skills/*/SKILL.md` names. |
| **`validate_skills.py`** | CI: `name` in YAML matches folder name. |
| **`verify_bundle_install.py`** | After **full** install into another project: check `vendor/own-skills`, `.cursor/skills` symlinks, run `validate_skills` in the bundle. |
| **`analyze_skills.py`** | Heuristic report: automation vs `scripts/`; **`--self-review`** = full repo Markdown (tiers, all skills, checklist); **`--markdown`** / **`--only-actionable`**. See **`skills-self-review-pro`**. |
| **`install_skill.py`** | Install a skill into `.cursor/skills` (default), and optionally `.claude/skills` + `.agent/skills` via `--all-ides` (`symlink` + `.git/info/exclude`). |
| **`../bin/own-skills.mjs`** | **npx** entry (`own-skills`): degit/git fetch + `install.sh` / `uninstall.sh`. |
| **`build_skill_index.py`** | Pre-build searchable skill index (triggers, descriptions) as JSON; optional `--with-embeddings` for semantic vectors. Used by `/route`, `/find-skill`, `/run-workflow` slash commands. |

## Commands

```bash
# From repo root, venv active

# Build / verify KB
python scripts/build_kb.py
python scripts/query_kb.py "your question" -k 5
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

# Single-skill install (optional; bundle install = npx own-skills)
python scripts/install_skill.py skills/git-operations-pro
python scripts/install_skill.py \
  --skill-dir skills/git-operations-pro \
  --project-dir /path/to/existing-project \
  --mode symlink

python scripts/install_skill.py \
  --skill-dir skills/git-operations-pro \
  --project-dir /path/to/existing-project \
  --mode symlink --all-ides

# Build skill index (for /route, /find-skill, /run-workflow slash commands)
python scripts/build_skill_index.py
python scripts/build_skill_index.py --dry-run
python scripts/build_skill_index.py --with-embeddings
```

## Config

All KB scripts read `<!-- kb-config -->` from `config.md` or `config.example.md` (see `kb_config_md.py`).

## Skill

For agent-oriented guidance on **when** to use these scripts vs skills-only Markdown, see bundled skills **`repo-tooling-pro`** (`skills/repo-tooling-pro/`) and **`skills-self-review-pro`** (`skills/skills-self-review-pro/`) for bundle audits.
