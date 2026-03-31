| Field | Value |
|-------|-------|
| title | Activity and decisions log |
| summary | Dated entries: user/agent decisions, audits, follow-ups for this skills template repo |
| tags | repo, activity, decisions |
| updated | 2026-04-01 |

# Activity and decisions log

**Purpose:** Record **short** notes on important decisions (not a substitute for git log). Maintainers or agents add a dated section when a decision is clear.

**Policy:** See [documentation-persistence.md](../policies/documentation-persistence.md) and Cursor rule **`.cursor/rules/documentation-persistence.mdc`**.

---

### 2026-04-01

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
