# Simple Skills

Skills + rules for AI agents: think → design → plan → execute → review → done.

- **Kit** `.agents/` — skills, tools, settings (installer)
- **Work** `.agent-work/` — sessions + memory (nested git; auto-gitignored)

Default install is lean (`core`). Details live in [docs/](docs/).

## Install

**Linux / macOS**

```bash
curl -fsSL https://raw.githubusercontent.com/truongnat/simple-skills/main/install.sh | bash
```

**Windows (PowerShell)**

```powershell
irm https://raw.githubusercontent.com/truongnat/simple-skills/main/install.ps1 | iex
```

**From a clone**

```bash
./install.sh --agents-mode replace          # or: ./install.ps1 -AgentsMode replace
./install.sh --profile office               # core + office
./install.sh --profile all                  # everything
```

Profiles: `core` (default) · `office` · `frontend` · `backend` · `all`  
(combine with commas, e.g. `--profile office,frontend`)

Then run the `init` skill once. Reinstall keeps an existing `settings.yaml`.

## After install

1. Agents read `AGENTS.md` → `.agents/AGENT_POLICY.md` → `.agents/SKILL_PREAMBLE.md`
2. Pick path: **Quick** (tiny fix) · **Lite** · **Full**
3. Work in `.agent-work/sessions/<Task-N-slug>/` — no `OVERVIEW.md`

```bash
bash .agents/tools/session/session.sh current
bash .agents/tools/session/session.sh status
python .agents/tools/session/validate_artifacts.py
```

Lifecycle (Full): brainstorming → business-analysis → design → planning → sync → execution → review → done.  
Step skills use a **Step ledger** and **Spec quality** gates before downstream work.  
TASK cards need Dev context (`[Source: …]`); sync readiness is `PASS` / `CONCERNS` / `FAIL`.

## Settings (keep small)

Edit `.agents/settings.yaml` only for:

- `language: en|vi`
- `rules.branch.mode: checkout|direct`
- `rules.reports.output_format: markdown|html`
- `rules.docs.*`

Everything else defaults in `AGENT_POLICY.md`.

## Skills

| Pack | What |
| --- | --- |
| `core` | Lifecycle: scaffold, init, brainstorming, business-analysis, design, planning, sync, execution, review, done, investigate, research, review-pr, tester, docs |
| `office` | + xlsx, docx, pptx, pdf |
| `frontend` / `backend` | + vendored SDLC skills ([THIRD_PARTY_SKILLS.md](docs/THIRD_PARTY_SKILLS.md)) |

## Docs

| File | Role |
| --- | --- |
| [docs/AGENTS.md](docs/AGENTS.md) | Short entrypoint |
| [docs/AGENT_POLICY.md](docs/AGENT_POLICY.md) | Full policy |
| [docs/AGENT_WORK.md](docs/AGENT_WORK.md) | Kit vs Work |
| [docs/SKILL_PREAMBLE.md](docs/SKILL_PREAMBLE.md) | Shared skill rules |
| [docs/settings.yaml](docs/settings.yaml) | Settings template |

## Dev checks

```bash
pip install -e ".[dev]"
python scripts/validate_skills.py
pytest -q
```
