# Workflow: research-synthesize

Workflows in this repo use **Markdown**: inputs/outputs and steps are headings and lists. An agent (or you) reads the file and runs it in order — no YAML engine required.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `research-synthesize` |
| **name** | Research then summarize |
| **version** | 1.0 |

## Description

Illustrative flow: step 1 gathers context; step 2 synthesizes. Replace skill and prompt names with real ones from your repo.

## Inputs

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `topic` | string | Yes | Topic to clarify |

## Outputs

| Variable | Type | Description |
|----------|------|-------------|
| `summary` | markdown | Final summary |

## Steps

### Step 1 — `gather-context`

- **Type:** skill
- **Skill:** `skill-template` (replace with a real skill, e.g. knowledge-base lookup, read `knowledge-base/INDEX.md`)
- **Input:** `query` = subject from `topic`
- **Output:** `gather_notes`

### Step 2 — `synthesize`

- **Type:** prompt template (id in [templates/PROMPT_TEMPLATES.md](../../templates/PROMPT_TEMPLATES.md))
- **Template:** `code-review-comprehensive` — example only; pick one suited to summarization
- **Input:** content from `gather_notes` (map into template vars like `code` or a “source content” section)
- **Content language:** markdown
- **Output:** `final_summary`
