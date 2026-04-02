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

### IMPROVEMENT_PLAN §4.2 compliance

Target shape for a **single-step** prompt: **Metadata** → **Purpose** → **Variables** → **System prompt** → **User prompt (template)** → **Few-shot examples** → **Chain: next step** — see [`../IMPROVEMENT_PLAN.md`](../IMPROVEMENT_PLAN.md) §4.2 and [`../templates/prompt/prompt-template.md`](../templates/prompt/prompt-template.md).

| Check | Current state |
|-------|----------------|
| **Few-shot examples** | Only [`planning/feature-planning.md`](planning/feature-planning.md) fully matches the §4.2 **Few-shot** section. **All other** `prompts/**/*.md` (except this README): **backlog** — add two examples (simple + edge) or document **N/A** in Metadata with reason. |
| **Chain: next step** | Present in: `planning/architecture-decision.md`, `review/code-review-request.md`, `review/security-review-request.md`, `generation/new-feature.md`, `generation/refactoring-task.md`, `debugging/bug-report.md`, `debugging/performance-profiling.md`, `debugging/root-cause-analysis.md`, `analysis/codebase-audit.md` (plus `feature-planning.md`). **Missing** on the remaining single-step prompts under `planning/`, `review/`, `generation/`, `analysis/` — **backlog**. |
| **`chains/*.md`** | Multi-step orchestration — **does not** use the same footer; the file **is** the chain. **`templates/example-skill-assisted-task.md`** is **legacy** — prefer [`planning/feature-planning.md`](planning/feature-planning.md). |

**Next step to reach “full spec”:** audit each `*.md` in the table above; add sections or justify exceptions in Metadata.
