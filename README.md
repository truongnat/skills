# simple-skills

A minimal set of skills and rules for AI agents, focused on clear workflows, readability, and extensibility. This repo does not turn skills into a complex framework — it provides concise working templates for agents handling tasks.

## Goals

- Help agents work through a clear lifecycle: think → plan → execute → review → done.
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
| `brainstorming` | Clarify goals, scope, trade-offs, and direction before starting |
| `planning` | Break down tasks, dependencies, acceptance criteria, and Definition of Done |
| `sync` | Sync codebase understanding, git state, and context (read-only by default) |
| `execution` | Record execution steps and changes made |
| `review` | Review correctness, regression risk, security, and maintainability |
| `done` | Summarize work, generate PR message, and handoff |
| `investigate` | Debug, analyze, or trace root cause before deciding to implement |
| `research` | Research internal or external sources before making decisions |
| `review-pr` | Review pull requests or diffs in a structured way |
| `tester` | Create test cases, verify, and record evidence |
| `business-analysis` | Clarify business requirements, scope, and process documentation |

## Repo Structure

```text
simple-skills/
├── docs/
│   ├── AGENTS.md          # Entrypoint with general agent rules
│   ├── DESIGN_SYSTEM.md   # Artifact design standards
│   └── TOOLS.md           # Tool references
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md       # Skill description, workflow, quality standards
│       └── agents/
│           └── openai.yaml # Flat contract fields (inputs, outputs, artifacts, safety)
├── install.sh             # Installer for Linux / macOS
├── install.ps1            # Installer for Windows (PowerShell)
└── install.cmd            # Wrapper calling install.ps1 on Windows
```

## Quick Start

After installation, agents read `.agents/AGENTS.md` as the entrypoint. Each task should create its own session:

```text
.agents/sessions/<Task-<number>-<short-description>>/
├── DISCUSSION.md    # brainstorming
├── PLAN.md          # planning
├── EXECUTION.md     # execution
├── REVIEW.md        # review
└── DONE.md          # done
```

Each skill's contract (required inputs, outputs, artifacts, safety constraints) is defined in `agents/openai.yaml`. The `SKILL.md` references it and provides the workflow, quality standards, and examples.

For detailed workflow, see [docs/AGENTS.md](docs/AGENTS.md).

## Development

`package.json` provides TypeScript/Rolldown tooling for future extensions. Installing skills does not require Node.js — only `curl` on Linux/macOS or PowerShell on Windows.
