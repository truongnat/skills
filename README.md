# simple-skills

A minimal set of skills and rules for AI agents, focused on clear workflows, readability, and extensibility. This repo does not turn skills into a complex framework — it provides concise working templates for agents handling tasks.

## Goals

- Help agents work through a clear lifecycle: think → design → plan → execute → review → done.
- Encourage artifact and session creation instead of running tasks vaguely.
- Easy to install into any repo by creating a `.agents` directory.

## Installation

Run from the project directory where you want to install the skills. The script will create `.agents/` there:

```text
.agents/
├── AGENTS.md
├── DESIGN_SYSTEM.md
├── TOOLS.md
└── skills/
    ├── brainstorming/
    │   ├── SKILL.md
    │   └── agents/
    │       └── openai.yaml
    ├── planning/
    └── ...
```

### Linux / macOS

```bash
curl -fsSL https://raw.githubusercontent.com/truongnat/simple-skills/main/install.sh | bash
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/truongnat/simple-skills/main/install.ps1 | iex
```

### Install from cloned repo

If you already cloned this repo, run the install script directly:

```bash
# Linux / macOS
./install.sh

# Windows (PowerShell)
./install.ps1

# Windows (CMD)
install.cmd
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

## Repo Structure

```text
simple-skills/
├── docs/
│   ├── AGENTS.md          # Entrypoint with general agent rules
│   ├── DESIGN_SYSTEM.md   # Artifact design standards
│   └── TOOLS.md           # Tool references
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md       # Authoritative skill + mandatory Contract
│       └── agents/
│           └── openai.yaml # Machine-readable contract duplicate
├── install.sh             # Installer for Linux / macOS
├── install.ps1            # Installer for Windows (PowerShell)
└── install.cmd            # Wrapper calling install.ps1 on Windows
```

## Quick Start

After installation, agents read `.agents/AGENTS.md` as the entrypoint. Each task should create its own session:

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

Each skill's **binding Contract** lives in `SKILL.md` under `## Contract (mandatory)` (Inputs, Outputs, Safety, required artifacts). `agents/openai.yaml` mirrors the same fields for tooling — agents must follow `SKILL.md`, not rely on opening the yaml alone.

For detailed workflow, see [docs/AGENTS.md](docs/AGENTS.md).

## Development

`package.json` provides TypeScript/Rolldown tooling for future extensions. Installing skills does not require Node.js — only `curl` on Linux/macOS or PowerShell on Windows.
