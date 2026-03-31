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
| **`install_skill.py`** | Install your own skill into existing project with isolation (`symlink` + `.git/info/exclude`). |
| **`uninstall.sh`** | Remove all skills installed by this project from a target project directory. |
| **`build_skill_index.py`** | Pre-build searchable skill index (triggers, descriptions) as JSON; optional `--with-embeddings` for semantic vectors. Used by `/route`, `/find-skill`, `/run-workflow` slash commands. |

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

# Install custom skill into another existing project (isolated)
# Easiest: use ./install.sh wrapper (installs all skills from default repo if no args)
./install.sh                    # Install ALL skills from https://github.com/truongnat/skills (shows progress bars)
./install.sh skills/git-ops     # Install specific skill
./install.sh https://github.com/user/repo.git  # Download directly from GitHub (no clone!)
./install.sh user/repo          # GitHub shorthand
./install.sh --remote https://github.com/user/repo.git  # Install ALL skills from ANY remote repo

# Or use Python directly (from within a skill folder or give explicit paths)
python scripts/install_skill.py --project-dir /path/to/existing-project --mode symlink

# Or use the one-command wrapper (supports remote URLs):
./install.sh skills/git-operations-pro                    # local skill
./install.sh https://github.com/user/repo.git            # remote repo
./install.sh user/repo                                   # GitHub shorthand
./install.sh --remote https://github.com/anyuser/anyrepo.git  # ALL skills from remote

# One-liner, no option flags (from anywhere):
python scripts/install_skill.py skills/git-operations-pro

# Explicit path (still easy):
python scripts/install_skill.py \
  --skill-dir skills/git-operations-pro \
  --project-dir /path/to/existing-project \
  --mode symlink

# Uninstall all skills from project (with confirmation):
./uninstall.sh
./uninstall.sh --project-dir /path/to/project
./uninstall.sh --force  # No confirmation prompt

# Build skill index (for /route, /find-skill, /run-workflow slash commands)
python scripts/build_skill_index.py
python scripts/build_skill_index.py --dry-run
python scripts/build_skill_index.py --with-embeddings
```

## Config

All KB scripts read `<!-- kb-config -->` from `config.md` or `config.example.md` (see `kb_config_md.py`).

## Skill

For agent-oriented guidance on **when** to use these scripts vs skills-only Markdown, see bundled skills **`repo-tooling-pro`** (`skills/repo-tooling-pro/`) and **`skills-self-review-pro`** (`skills/skills-self-review-pro/`) for bundle audits.
