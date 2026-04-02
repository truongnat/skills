# Prompts (job-to-be-done)

Reusable **Markdown** prompts with `{{variables}}`. Organized by category; each file should follow the structure in **`templates/prompt/prompt-template.md`** (metadata, purpose, system + user sections).

| Category | Folder | Examples |
|----------|--------|----------|
| Planning | [`planning/`](planning/) | Feature planning, ADR prep, risk |
| Review | [`review/`](review/) | Code, security, performance, API |
| Debugging | [`debugging/`](debugging/) | Bug report, RCA, profiling |
| Generation | [`generation/`](generation/) | Features, tests, docs, migrations |
| Analysis | [`analysis/`](analysis/) | Codebase audit, dependencies, skill gaps |
| Chains | [`chains/`](chains/) | Multi-step sequences |

**Legacy:** [`templates/example-skill-assisted-task.md`](templates/example-skill-assisted-task.md) — prefer [`planning/feature-planning.md`](planning/feature-planning.md).

**Broader library:** [`../templates/PROMPT_TEMPLATES.md`](../templates/PROMPT_TEMPLATES.md) (monolith index).

**Workflows:** [`../workflows/`](../workflows/) — executable step contracts.

**Output style:** [`../OUTPUT_CONVENTIONS.md`](../OUTPUT_CONVENTIONS.md).
