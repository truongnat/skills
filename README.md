# simple-skills

A minimal set of skills and rules for AI agents, focused on clear workflows, readability, and extensibility. This repo does not turn skills into a complex framework — it provides concise working templates for agents handling tasks.

## Goals

- Help agents work through a clear lifecycle: think → design → plan → execute → review → done.
- Encourage artifact and session creation instead of running tasks vaguely.
- Easy to install into any repo by creating a `.agents` directory.

## Installation

Run from the project directory where you want to install the skills. The script
places `AGENTS.md` at the project root and supporting files under `.agents/`:

```text
AGENTS.md
.agents/
├── DESIGN_SYSTEM.md
├── THIRD_PARTY_SKILLS.md
└── skills/
    ├── brainstorming/
    │   ├── SKILL.md
    │   └── agents/
    │       └── openai.yaml
    ├── planning/
    └── ...
```

The installer only copies skills and does not install Python packages.
Python-based skills create a private `.venv` from their own `requirements.txt`
on first use.

If root `AGENTS.md` already exists, choose one conflict policy:

- `prompt` (default): ask before replacement; keep the file when no interactive
  terminal is available.
- `replace`: replace it without prompting.
- `skip`: always keep it.

Set `SIMPLE_SKILLS_AGENTS_MODE=prompt|replace|skip`, or pass the corresponding
installer option.

### Linux / macOS

```bash
curl -fsSL https://raw.githubusercontent.com/truongnat/simple-skills/main/install.sh | bash

# Non-interactive replacement
curl -fsSL https://raw.githubusercontent.com/truongnat/simple-skills/main/install.sh \
  | bash -s -- --agents-mode replace
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/truongnat/simple-skills/main/install.ps1 | iex

# Non-interactive replacement
$env:SIMPLE_SKILLS_AGENTS_MODE = "replace"
irm https://raw.githubusercontent.com/truongnat/simple-skills/main/install.ps1 | iex
```

### Install from cloned repo

If you already cloned this repo, run the install script directly:

```bash
# Linux / macOS
./install.sh --agents-mode prompt

# Windows (PowerShell)
./install.ps1 -AgentsMode prompt

# Windows (CMD)
install.cmd -AgentsMode prompt
```

## Available Skills

| Skill | Purpose |
| --- | --- |
| `brainstorming` | Step workflow: seed DISCUSSION template → frame → options → recommend → self-check |
| `business-analysis` | Clarify business requirements, scope, and process documentation |
| `basic-design` | System-level design: boundaries, components, flows, interfaces, data ownership |
| `detail-design` | Implementable design: contracts, data model, sequences, rules/operations (dynamic depth) |
| `planning` | Step workflow: seed PLAN/TASKS templates → fill strategy → micro-tasks → self-check |
| `sync` | Sync codebase understanding, git state, and context (read-only by default) |
| `execution` | Record execution steps and changes made |
| `review` | Review correctness, regression risk, security, and maintainability |
| `done` | Summarize work, generate PR message, and handoff |
| `investigate` | Debug, analyze, or trace root cause before deciding to implement |
| `research` | Research internal or external sources before making decisions |
| `review-pr` | Review pull requests or diffs in a structured way |
| `tester` | Create test cases, verify, and record evidence |

### First-party office skills (Python)

| Skill | Purpose |
| --- | --- |
| `xlsx` | Inspect/create/edit/validate `.xlsx` with supported-lossless coverage |
| `docx` | Inspect/create/edit/validate `.docx` with supported-lossless coverage |
| `pptx` | Inspect/create/edit/validate `.pptx` with supported-lossless coverage |
| `pdf` | Inspect/create/edit/validate PDF with supported-lossless coverage |

These skills use Python CLIs under `skills/<name>/scripts/cli.py` plus shared
helpers in `skills/office-common/`. Create/edit requires `coverage_ratio == 1.0`
before publish. Run `python .agents/skills/<name>/scripts/setup.py` on first
use; dependencies stay in that skill's `.venv`. Repository development can use
`pip install -e ".[dev]"`.

### Vendored foundational skills (SDLC roles)

| Category | Skills |
| --- | --- |
| Web frontend | `web-component-design`, `accessibility-compliance` |
| Design system | `design-system-patterns`, `visual-design-foundations` |
| Apps | `expo-native-ui`, `expo-data-fetching` |
| Backend / API | `nodejs-backend-patterns`, `api-design-principles` |
| Database | `postgresql-table-design`, `sql-optimization-patterns`, `database-migration` |
| Networking | `microservices-patterns`, `hybrid-cloud-networking` |
| Architecture | `architecture-patterns`, `architecture-decision-records` |
| Security | `sast-configuration`, `auth-implementation-patterns`, `stride-analysis-patterns` |
| Testing | `javascript-testing-patterns`, `e2e-testing-patterns` |
| DevOps / CI | `deployment-pipeline-design`, `github-actions-templates` |
| Observability / debug | `distributed-tracing`, `debugging-strategies` |

These third-party skills are pinned by source revision and retain their license
notices in [docs/THIRD_PARTY_SKILLS.md](docs/THIRD_PARTY_SKILLS.md).

## Repo Structure

```text
simple-skills/
├── docs/
│   ├── AGENTS.md          # Entrypoint with general agent rules
│   ├── DESIGN_SYSTEM.md   # Template for host-project design references
│   └── THIRD_PARTY_SKILLS.md # Vendored sources and licenses
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md       # Authoritative skill definition
│       └── agents/        # Optional machine-readable metadata
├── install.sh             # Installer for Linux / macOS
├── install.ps1            # Installer for Windows (PowerShell)
└── install.cmd            # Wrapper calling install.ps1 on Windows
```

## Quick Start

After installation, agents read root `AGENTS.md` as the entrypoint. Each task
should create its own session:

```text
.agents/sessions/<Task-<number>-<short-description>>/
├── DISCUSSION.md      # brainstorming
├── BASIC_DESIGN.md    # basic-design
├── DETAIL_DESIGN.md   # detail-design
├── PLAN.md            # planning (strategy)
├── TASKS.md           # planning (detailed tasks)
├── EXECUTION.md       # execution
├── REVIEW.md          # review
└── DONE.md            # done
```

Each first-party workflow skill's **binding Contract** lives in `SKILL.md`
under `## Contract (mandatory)`. Third-party skills retain their upstream
instructions. Agents must always follow `SKILL.md`, not rely on metadata alone.

For detailed workflow, see [docs/AGENTS.md](docs/AGENTS.md).

## Development

Installing skills does not require Node.js — only `curl` on Linux/macOS or PowerShell on Windows.

Office skill Python tests:

```bash
pip install -e ".[dev]"
python scripts/validate_office_skills.py
pytest -q
```
