# Workflows

A workflow is a **Markdown contract** (`.md` file) describing a sequence of steps: each step invokes a **skill** (by `name` in `SKILL.md`) or references a **prompt template** in `prompts/` / [templates/PROMPT_TEMPLATES.md](../templates/PROMPT_TEMPLATES.md).

This repo does **not** require an automated engine: an agent (or you) reads the file and executes steps in order; you can add a dedicated runner later.

## Naming

- **Runnable workflow files** use the prefix **`w-`**: pattern **`w-<slug>.md`** (e.g. `w-ticket.md`, `w-hotfix.md`, `w-release.md`). This matches slash commands **`/w-<slug>`** via a single stub in **`commands/w-<slug>.md`** (deployed to **`.cursor/commands/`** and **`.claude/commands/`** by the installer, or symlinked in this repo for dev).
- **Index files** only: `README.md` in `workflows/` or `workflows/<domain>/` — **no** `w-` prefix.

## Bundled workflows (by domain)

| Domain | Index | Workflows |
|--------|--------|-----------|
| **dev** | [`dev/README.md`](dev/README.md) | [`dev/w-ticket.md`](dev/w-ticket.md) (`ticket`, **`/w-ticket`**), [`dev/w-hotfix.md`](dev/w-hotfix.md) (`hotfix`, **`/w-hotfix`**), [`dev/w-release.md`](dev/w-release.md) (`release`, **`/w-release`**), [`dev/w-code-review.md`](dev/w-code-review.md), [`dev/w-debug.md`](dev/w-debug.md), [`dev/w-security-audit.md`](dev/w-security-audit.md), [`dev/w-arch-review.md`](dev/w-arch-review.md), [`dev/w-perf-investigation.md`](dev/w-perf-investigation.md), [`dev/w-refactor.md`](dev/w-refactor.md), [`dev/w-incident.md`](dev/w-incident.md), [`dev/w-data-migration.md`](dev/w-data-migration.md), [`dev/w-onboarding.md`](dev/w-onboarding.md), [`dev/w-api-design.md`](dev/w-api-design.md), [`dev/w-test-strategy.md`](dev/w-test-strategy.md), [`dev/w-dep-audit.md`](dev/w-dep-audit.md), [`dev/w-index-project.md`](dev/w-index-project.md) (**`/w-index-project`**) |

Slash commands are authored once under **`commands/`** (see [`commands/README.md`](../commands/README.md)). **`w-*.md`** stubs include **`targets: [cursor, claude]`** by default. Routing helpers (`route`, `optimize`, `find-skill`, `run-workflow`) use **`targets: [claude]`** only. **`.cursor/commands/`** and **`.claude/commands/`** in this repo are symlinks into **`commands/`** for IDE discovery.

## Parallel execution

Workflows may describe **safe concurrency** for agent hosts that support sub-agents (e.g. Cursor **Task** tool). Use a dedicated **`## Parallelization`** section (or bullets under **Steps**) with explicit **fork/join** semantics.

| Marker | Use |
|--------|-----|
| **`parallel-with: Step N`** | This step may run **at the same time** as Step *N* after shared prerequisites are done. |
| **`parallel-each: <unit>`** | **Fan-out:** one parallel task per `<unit>` (e.g. per module, per file); **join** before the next step that needs all units. |

**Rules of thumb:**

- Document **what must finish before** a fork and **what must exist before** the join.
- Prefer **independent outputs** (separate files) for parallel units to avoid merge conflicts.
- If the host has no Task API, agents should **fall back to sequential** execution in step order.

## Convention (Markdown)

Each workflow should include:

1. **Title** `# Workflow: <id>`
2. **Metadata table or list** — `id`, `name`, `version`
3. **Inputs / Outputs** — variable table
4. **Steps** — each step is `###` with:
   - Type: `skill` or prompt template / doc reference
   - Skill name or template id
   - Input/output (variables may use `` `topic` ``)

## Short example

Save as **`w-my-flow.md`** (see [Naming](#naming) above).

```markdown
# Workflow: my-flow

## Metadata
| Field | Value |
|-------|-------|
| **id** | `my-flow` |
| **version** | 1.0 |

## Inputs
| Variable | Required |
|----------|----------|
| `topic` | Yes |

## Steps
### Step 1 — collect
- **Type:** skill
- **Skill:** `my-skill`
- **Input:** `query` = `topic`
```

## Layout

- Domain folders under **`workflows/<domain>/`** (e.g. **`dev/`**). Add **`README.md`** per domain when you introduce a new folder. Update root **`README.md`** when you add or move workflow files.
