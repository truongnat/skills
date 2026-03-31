# Workflows

A workflow is a **Markdown contract** (`.md` file) describing a sequence of steps: each step invokes a **skill** (by `name` in `SKILL.md`) or references a **prompt template** in `prompts/` / [templates/PROMPT_TEMPLATES.md](../templates/PROMPT_TEMPLATES.md).

This repo does **not** require an automated engine: an agent (or you) reads the file and executes steps in order; you can add a dedicated runner later.

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

## Directories

- `examples/` — sample workflows to copy (`.md`).
