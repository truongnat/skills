# Simple Skills

Skills + rules for AI agents: think → design → plan → execute → review → done.

- **Kit** `.agents/` — skills, tools, settings (installer)
- **Work** `.agent-work/` — sessions + memory (nested git; `session.sh commit` / `archive`; auto-gitignored)

Start with [docs/START_HERE.md](docs/START_HERE.md). Skill map: [docs/WHAT_NEXT.md](docs/WHAT_NEXT.md).

## Install

```bash
pipx install simple-skills    # once (PyPI)
sk install                    # in your project
sk doctor
sk uninstall --yes
```

Also: `uv tool install simple-skills`.  
Profiles: `sk install --profile office` · `frontend` · `backend` · `all` (default `core`).  
Then run **`init`**. Reinstall keeps `settings.yaml`.

Until the package is on PyPI (or for a fork):

```bash
pipx install git+https://github.com/truongnat/simple-skills.git
# or: curl -fsSL https://raw.githubusercontent.com/truongnat/simple-skills/main/i | bash
```

## After install

```bash
sk doctor
bash .agents/tools/session/session.sh help
```

| Path | Skill |
| --- | --- |
| **Quick** (tiny fix) | `quick-fix` → sync → execution → review → done |
| **Lite** / **Full** | brainstorming → (business-analysis) → design → planning → … |

Step skills use a **Step ledger** and **Spec quality** gates (not on Quick).  
Lint: `python .agents/tools/session/lint_artifacts.py`  
Handoff pack: `python .agents/tools/session/build_context.py`

## Settings (keep small)

`language` · `rules.branch.mode` · `rules.reports.output_format` · `rules.docs.*`  
Defaults in `AGENT_POLICY.md`.

## Docs

| File | Role |
| --- | --- |
| [START_HERE](docs/START_HERE.md) | 2-minute start |
| [WHAT_NEXT](docs/WHAT_NEXT.md) | Situation → skill |
| [AGENTS](docs/AGENTS.md) | Entrypoint |
| [AGENT_POLICY](docs/AGENT_POLICY.md) | Full policy |
| [AGENT_WORK](docs/AGENT_WORK.md) | Kit vs Work + git ownership |
| [MIGRATION](docs/MIGRATION.md) | Host upgrade notes |
| [examples](docs/examples/README.md) | Good/bad session shapes |

## Dev checks

```bash
pip install -e ".[dev]"
python scripts/validate_skills.py
pytest -q
sk --help
```

## Publish (maintainers)

Name on PyPI: **`simple-skills`** (available). After one Trusted Publisher setup:

1. https://pypi.org/manage/account/publishing/ → pending publisher for `simple-skills`, repo `truongnat/simple-skills`, workflow `publish.yml`, environment `pypi`
2. Create GitHub Environment `pypi` (optional protection rules)
3. GitHub → Release (tag `v0.2.0`) → workflow publishes the wheel

Then users only need `pipx install simple-skills` → `sk install`.
