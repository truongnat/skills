| Field | Value |
|-------|-------|
| title | Activity and decisions log |
| summary | Dated entries: user/agent decisions, audits, follow-ups for this skills template repo |
| tags | repo, activity, decisions |
| updated | 2026-04-02 |

# Activity and decisions log

**Purpose:** Record **short** notes on important decisions (not a substitute for git log). Maintainers or agents add a dated section when a decision is clear.

**Policy:** See [documentation-persistence.md](../policies/documentation-persistence.md) and Cursor rule **`.cursor/rules/documentation-persistence.mdc`**.

---

### 2026-04-02

- **Change:** **IMPROVEMENT_PLAN.md** — added **Implementation status** (rolling snapshot + `build-skill-index` convention); **Diagnosis** labeled historical baseline. **`prompts/README.md`** — §4.2 compliance table (Few-shot / Chain audit backlog). **`skills/SKILL_AUTHORING_RULES.md`** §8 — row for substantive skill edits → **`node dist/tools.js build-skill-index`**.

- **Change:** **Templates sweep:** [`templates/PROMPT_TEMPLATES.md`](../../../templates/PROMPT_TEMPLATES.md) — “Using templates” now documents **`node dist/tools.js`** + `prompts/` (removed nonexistent `use_template.py`); banners/repo notes on [`templates/SKILL_SYSTEM_GUIDE.md`](../../../templates/SKILL_SYSTEM_GUIDE.md), [`templates/COOL_TECHNOLOGIES.md`](../../../templates/COOL_TECHNOLOGIES.md); fixed header + LangChain section + repo note on [`templates/GITHUB_DEPLOYMENT_GUIDE.md`](../../../templates/GITHUB_DEPLOYMENT_GUIDE.md).

- **Change:** **IMPROVEMENT_PLAN wave (mobile + desktop):** **`react-native-pro`**, **`flutter-pro`**, **`electron-pro`** — added `references/` (`anti-patterns`, `decision-tree`, `integration-map`, `versions`) and **`SKILL.md`** updates (Operating principles, Anti-patterns / decision / integration / versions summaries, Resources, three Quick examples, checklist). Ran `node dist/tools.js build-skill-index`.

- **Change:** **Docs sweep (Python → Node CLI):** updated **`skills-self-review-pro`** (`SKILL.md`, `references/*`), **`knowledge-base/VERIFY.md`**, **`README.md`**, **`embeddings/README.md`**, runbook **`rebuild-knowledge-base-index.md`**, **`config.example.md`**, **`templates/config.template.md`**, **`templates/START_HERE.md`**, **`PROJECT_GAP_ANALYSIS.md`**, **`web-research-pro`** workflow reference; **`.cursor/rules/documentation-persistence.mdc`**; policy **`documentation-persistence.md`** — commands use **`node dist/tools.js`** per [`scripts/README.md`](../../../scripts/README.md).

- **Change:** **Repo tooling + workflows:** rewrote [`skills/repo-tooling-pro/`](../../../skills/repo-tooling-pro/) (frontmatter, `SKILL.md`, `references/*`) for **Node** `dist/tools.js` / `npm` (removed Python/venv drift); updated [`skills/README.md`](../../../skills/README.md) bundle-audit commands. Added **Decision paths**, **Error handling**, **Output format** (link [`OUTPUT_CONVENTIONS.md`](../../../OUTPUT_CONVENTIONS.md)), **Time estimate**, **Escalation** to [`workflows/dev/w-ticket.md`](../../../workflows/dev/w-ticket.md) (v1.2), [`w-release.md`](../../../workflows/dev/w-release.md), [`w-hotfix.md`](../../../workflows/dev/w-hotfix.md).

- **Change:** **Support skills depth:** expanded **`planning-pro`**, **`feedback-pro`**, **`git-operations-pro`** — richer `tips-and-tricks.md` and `edge-cases.md` (examples: phased plans, finding tables, `git` command blocks); optional **`decision-tree.md`** + **`anti-patterns.md`** per skill; updated **`SKILL.md`** (summaries, Resources, three Quick examples, checklist). Ran `build-skill-index` / `validate-skills`.

- **Change:** **IMPROVEMENT_PLAN Phase 6 (start):** added core/mid-tier `references/` depth — **`nestjs-pro`**, **`postgresql-pro`** (`decision-tree`, `integration-map`, `anti-patterns`, `versions`) + **`SKILL.md`** updates; **`docker-pro`**, **`ci-cd-pro`**, **`auth-pro`**, **`caching-pro`** (`decision-tree`, `anti-patterns`; **ci-cd** also `tips-and-tricks`, `edge-cases`); **`ai-integration-pro`** (`decision-tree`, `anti-patterns`, `tips-and-tricks`, `edge-cases`, `integration-map`, `versions`). Expanded **Quick example** to three scenarios and **Resources** tables where updated. Ran `node dist/tools.js build-skill-index`.

- **Change:** Completed **IMPROVEMENT_PLAN** §3.2 gap: added workflows [`w-data-migration.md`](../../../workflows/dev/w-data-migration.md), [`w-onboarding.md`](../../../workflows/dev/w-onboarding.md), [`w-api-design.md`](../../../workflows/dev/w-api-design.md), [`w-test-strategy.md`](../../../workflows/dev/w-test-strategy.md), [`w-dep-audit.md`](../../../workflows/dev/w-dep-audit.md) with Cursor slash stubs under [`.cursor/commands/`](../../../.cursor/commands/); updated root **README**, **AGENTS**, [`workflows/README.md`](../../../workflows/README.md), [`workflows/dev/README.md`](../../../workflows/dev/README.md).

- **Source:** user + agent

### 2026-04-01

- **Change:** **IMPROVEMENT_PLAN** implementation: repo root [`OUTPUT_CONVENTIONS.md`](../../../OUTPUT_CONVENTIONS.md); report templates under [`templates/report/`](../../../templates/report/) (including performance + incident); [`skills/SKILL_AUTHORING_RULES.md`](../../../skills/SKILL_AUTHORING_RULES.md) §10–§12 (quality rubric, prompt guidance, update-vs-new decision tree); expanded [`workflows/dev/w-code-review.md`](../../../workflows/dev/w-code-review.md) and [`w-debug.md`](../../../workflows/dev/w-debug.md) with decision paths, error handling, output contracts; new workflows [`w-security-audit.md`](../../../workflows/dev/w-security-audit.md), [`w-arch-review.md`](../../../workflows/dev/w-arch-review.md), [`w-perf-investigation.md`](../../../workflows/dev/w-perf-investigation.md), [`w-refactor.md`](../../../workflows/dev/w-refactor.md), [`w-incident.md`](../../../workflows/dev/w-incident.md); [`prompts/`](../../../prompts/) reorganized by job (planning, review, debugging, generation, analysis, chains) with priority prompt files; template scaffolds under [`templates/prompt/`](../../../templates/prompt/), [`templates/workflow/`](../../../templates/workflow/), [`templates/issue/`](../../../templates/issue/), [`templates/kb-document/`](../../../templates/kb-document/); deepened **react-pro**, **nextjs-pro**, **security-pro**, **testing-pro**, **typescript-pro** with anti-patterns summaries, decision trees, integration maps, and expanded quick examples. Updated root **README**, **AGENTS**, **workflows** indexes, **templates/README**.

- **Change:** Full script runtime migrated to **TypeScript/Node**: added `src/` + `tsconfig.json`, compiled `dist/own-skills.js` and `dist/tools.js`, replaced Python tooling commands (`scripts/*.py`) with TypeScript command map (`list-skills`, `validate-skills`, `analyze-skills`, `build-skill-index`, `install-skill`, `verify-bundle-install`, `build-kb`, `query-kb`, `query-kb-batch`, `verify-kb`).
- **Change:** Removed legacy runtime files: `install.sh`, `uninstall.sh`, `bin/own-skills.mjs`, and all Python scripts under `scripts/`.
- **Change:** Updated command references in root README, scripts README, AGENTS, and `w-ticket` workflow command docs to Node/TS command forms.

- **Change:** Migrated **`bin/own-skills.mjs`** to **Node-only install/uninstall** (no `bash` dependency): bundle sync, rule link/copy, `install_skill.py` execution per skill, and Node filesystem-based uninstall. Prompt UX now uses option lists instead of Y/N confirms for key choices.

- **Change:** **Install UX:** removed **`install-remote.sh`** and **`uninstall-remote.sh`**; documented **npx** + **`bin/own-skills.mjs`** only. Root **`install.sh`** / **`uninstall.sh`** remain as engines invoked by the CLI (not removed).

- **Change:** **`w-ticket`** rework: ticket flow uses **only** bundled [`skills/`](../../../skills/) (catalog + `list_skills.py`); **`kanban/<ticket>/`** contract inlined in [`workflows/dev/w-ticket.md`](../../../workflows/dev/w-ticket.md) (no `ex/ticket`). Updated **`/w-ticket`** commands, **AGENTS**, **`w-release`** cross-refs.

- **Change:** Added **release** workflow [`workflows/dev/w-release.md`](../../../workflows/dev/w-release.md) (notes → implementation detail) and slash **`/w-release`** ([`.claude/commands/w-release.md`](../../../.claude/commands/w-release.md)); updated **`workflows/dev/README.md`**, root **README**, **AGENTS**, **templates**, **`run-workflow`**.

- **Change:** **Workflows:** moved ticket workflow to [`workflows/dev/w-ticket.md`](../../../workflows/dev/w-ticket.md); added hotfix as [`workflows/dev/w-hotfix.md`](../../../workflows/dev/w-hotfix.md) (renamed from `hotfix.md`) and slash **`/w-hotfix`**. Documented **naming rule** — runnable workflow files **`w-<slug>.md`** in [`workflows/README.md`](../../../workflows/README.md#naming). Updated root **README**, **AGENTS**, **`run-workflow`** / **`route`**, **§8** workflow row.

- **Source:** user + agent
- **Change:** Added **`scripts/verify_bundle_install.py`** to sanity-check full bundle installs in a target project; README + `install.sh` hint.
- **Change:** Normalized user-facing docs to **English** (README Quick start, activity log, KB INDEX, documentation persistence policy + Cursor rules, `formatting-common.mdc`, prompts, `external-review-mapping.md`, `web-research-pro` related-skills row; aligned `config.md` with `config.example.md`).
- **Change:** Simplified **remote** docs: two `curl` lines (install/uninstall) in README; removed zx / `install-remote.mjs` / `package.json`; streamlined `install-remote.sh` / `uninstall-remote.sh`; re-run install = **update** (messages in `install.sh`); removed `install-bundle-layout.md`.
- **Change:** Bundled skill **`cli-pro`** (advanced CLI: argv, exit/stderr, pipes/TTY, completion); updated §8 (`README`, `AGENTS`, `skills-layout`, `SKILL_AUTHORING_RULES` §1).
- **Change:** Remote install defaults to **multi-IDE**: `install-remote.sh` calls `install.sh --all-ides` (Cursor `.cursor/skills`, Claude Code `.claude/skills`, Antigravity `.agent/skills`); `install_skill.py` adds `--ides` / `--all-ides`; `uninstall.sh` removes all three paths; README / `scripts/README` updated.
- **Change:** **Full bundle install**: `install.sh --full` / remote default copies the repo into `<project>/vendor/own-skills`, symlinks `.cursor/rules`, then installs skills from vendor (avoids broken symlinks after temp clone); `--skills-only` keeps skills-only behavior; `uninstall.sh` removes `vendor/own-skills` and related rule symlinks.
- **Change:** **Remote uninstall via pipe**: `uninstall-remote.sh` sets `--force` when stdin is not a TTY (avoids `read` EOF + `set -e`); `uninstall.sh` skips `read` when non-TTY; fixed `((removed_count++))` with `set -e`; README notes non-interactive behavior.

### 2026-03-31

- **Source:** agent + user request
- **Change:** Added **documentation-persistence** rule, policy + activity log; extended **skills-self-review-pro** (tech refresh + **web-research-pro**).
- **Follow-up:** Run `build_kb` after KB corpus changes; periodically self-review + official docs for the stack.
- **Change:** New skill **`market-research-pro`** (SKILL + references) and README/AGENTS/skills-layout per §8.
- **Change:** New skill **`strategic-consulting-pro`** (SKILL + references) and README/AGENTS/skills-layout/SKILL_AUTHORING_RULES per §8.

### YYYY-MM-DD (template)

- **Source:** (user / agent / CI)
- **Change:** (e.g. run `analyze_skills.py --self-review`, add skill X)
- **Conclusion / follow-up:** (…)
