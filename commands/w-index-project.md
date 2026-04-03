---
targets:
  - cursor
  - claude
---

# /w-index-project — Run the index-project workflow

You are executing the **index-project** workflow (**file** [`workflows/dev/w-index-project.md`](../workflows/dev/w-index-project.md)).

## User input

$ARGUMENTS

## Instructions

1. **Read** [`workflows/dev/w-index-project.md`](../workflows/dev/w-index-project.md) in full (Metadata, Inputs, Outputs, Decision paths, Steps, Notes).
2. **Resolve inputs:** `project_root` (required — default to workspace root if user omits it); optional `scope` (`quick` \| `standard` \| `deep`, default **standard**); optional `focus_modules`.
3. **Execute Steps 1–7.** Follow numeric order **unless** [`workflows/dev/w-index-project.md`](../workflows/dev/w-index-project.md) **Parallelization** allows concurrency: **Steps 3 and 4** may run **in parallel** (both need only Steps 1–2). **Step 4** may use **one sub-agent per module** (`parallel-each: module`). When the IDE supports it, use the **Task** tool (`subagent_type` e.g. `generalPurpose` or `explore`) for parallel work; otherwise run sequentially.
4. **Produce** `project_index_report` using [`templates/report/project-index-report.md`](../templates/report/project-index-report.md) and [`OUTPUT_CONVENTIONS.md`](../OUTPUT_CONVENTIONS.md). Record **`wiki_path`** after Step 7 when applicable.

## Rules

- Create **`<index_base>/docs/`** and **`modules/`** as needed; default **`<project_root>/.agents/devkit/project-index`** for `index_path` unless the user specifies otherwise.
- After Step 5, verification queries **must** use **`query-kb ... --index <index_path>`** so hits come from the **project** index, not the template repo KB.
- **Step 7:** Prefer **`npx gitnexus wiki`** when `npx gitnexus status` succeeds; else **`node dist/tools.js generate-wiki --docs <index_base>/docs --out <index_base>/wiki`** from the devkit root. Optional **`--watch`** / **`--open`** on the built-in command when the user wants a live refresh loop or to open the wiki immediately.
- Do not store secrets or tokens in generated Markdown.
