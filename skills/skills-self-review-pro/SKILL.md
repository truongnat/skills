---
name: skills-self-review-pro
description: |
  Self-review of the skills template: structured gap and improvement reports using repo CLI (`node dist/tools.js analyze-skills`, `validate-skills`, `list-skills`), cross-checks against SKILL_AUTHORING_RULES.md, optional **tech refresh** via **`web-research-pro`** (official docs, release notes), and clear limits of automation vs human judgment.

  Use this skill when the user wants a **periodic audit** of bundled skills, a **PR checklist** for skill changes, an **automation vs scripts** backlog, or asks to **find gaps** and **suggested improvements** without manually opening every `SKILL.md` — or to **align** stack skills with **current** upstream technology.

  Use **with** **`repo-tooling-pro`** for script flags and CI wiring; **`web-research-pro`** for **internet / official** doc verification; **`git-operations-pro`** when the output becomes a **commit** or **PR** artifact. Persist decisions in **`knowledge-base/documents/`** per **`.cursor/rules/documentation-persistence.mdc`**. This skill (`skills-self-review-pro`) owns **review methodology and report shape**; scripts own **deterministic checks**.

  Triggers: "skill self review", "audit skills", "gap report", "improve bundled skills", "analyze_skills", "validate_skills inventory", "authoring checklist", "skill quality", "SKILL.md review", "tech refresh skills", "update skills for new React", "official docs check", "tier rubric", "with-references", "only-actionable", "build-skill-index", "false positive tier".

metadata:
  short-description: Skills self-review — gaps, authoring check, scripts, web research for tech refresh
---

# Skills self-review (professional)

Use **`node dist/tools.js analyze-skills`**, **`validate-skills`**, and **`list-skills`** from **repo root** (see [`scripts/README.md`](../../scripts/README.md)); this skill encodes **how** to combine outputs into an **actionable** improvement narrative — not a substitute for reading **`SKILL_AUTHORING_RULES.md`**. Confirm **cwd** is repo root and **`npm install`** / **`npm run build`** have been run so **`dist/tools.js`** exists.

## Related skills (this repo)

| Skill | When to combine with `skills-self-review-pro` |
|-------|-----------------------------------------------|
| **`repo-tooling-pro`** | Exact CLI flags, **`query_kb`**, KB rebuild after doc edits |
| **`web-research-pro`** | **Official** docs, changelogs, **404** handling — **not** local `analyze_skills` output |
| **`git-operations-pro`** | Attach report to **PR**, **conventional** commit for tooling changes |
| **`business-analysis-pro`** | Rare — only if review outputs must become **formal** backlog items |

**Boundary:** **`skills-self-review-pro`** = **meta** review of the skill bundle; domain **`react-pro`** etc. = **product** stack guidance.

## When to use

- **Before merge** of large skill additions — run **`validate_skills`** + **`analyze_skills --markdown`**.
- **Quarterly** or **milestone** hygiene — generate gap list for maintainers.
- **Onboarding** — explain how bundled skills are **checked** in this repo.
- **Tech refresh** — pair script audit with **`web-research-pro`** + official docs for stacks you maintain.
- Trigger keywords: `self review`, `gap report`, `analyze_skills`, `validate_skills`, `authoring`, `tech refresh`, …

## Workflow

1. Confirm **repo root**, availability of **`dist/tools.js`**, whether **`--with-references`** / **`--only-actionable`** apply, and whether the user wants **upstream doc** research (**`web-research-pro`**).
2. Apply the principles and topic summaries below; open `references/` when you need depth; run **`node dist/tools.js analyze-skills --self-review`** for a **complete** repo report; **persist** notable outcomes under **`knowledge-base/documents/`** (see **`.cursor/rules/documentation-persistence.mdc`**).
3. Respond using **Suggested response format**; note **heuristic** limits, **manual** checks, and **doc** updates needed for **INDEX** / **build_kb**.

### Operating principles

1. **Scripts first** — Deterministic checks (`validate_skills`) before subjective critique.
2. **Separate concerns** — **Automation/script** gaps (`analyze_skills`) vs **structure** (`SKILL_AUTHORING_RULES.md`) vs **content quality** (human).
3. **Actionable backlog** — Each gap: **owner**, **suggested fix** (link script, add workflow, edit `references/`).
4. **No scope creep** — Review does not **rewrite** unrelated skills in one pass unless user asked.
5. **Reproducible** — Save **`--markdown`** output next to PR or in **`knowledge-base/documents/`** if the team wants history (update **`INDEX.md`**); append **decisions** to **`documents/repo/activity-log.md`** when appropriate.
6. **Honest limits** — Heuristics miss **neutral** wording and **duplicate** conceptual scope; **Related skills** tables need human read.

### Tech refresh and web research (summary)

- After local **`analyze_skills`**, use **`web-research-pro`** (and **Context7** / official docs MCP when available) for **stack** updates; log in **`activity-log.md`**.

Details: [references/tech-refresh-and-web-research.md](references/tech-refresh-and-web-research.md)

### Report structure and script gaps (summary)

- **Tiers**, **`--markdown`**, interpretation — **`analyze_skills`**.

Details: [references/report-structure-and-scripts.md](references/report-structure-and-scripts.md)

### Authoring rules cross-check (summary)

- **`validate_skills`**, **`list_skills`**, **`SKILL_AUTHORING_RULES.md`** §2–§8 checklist.

Details: [references/authoring-rules-crosscheck.md](references/authoring-rules-crosscheck.md)

### Tips and tricks (summary)

- PR attachment, KB verify, golden **low-tier** skills.

Details: [references/tips-and-tricks.md](references/tips-and-tricks.md)

### Edge cases (summary)

- False positives/negatives, template include, private forks.

Details: [references/edge-cases.md](references/edge-cases.md)

### Decision flow and anti-patterns (summary)

- PR vs quarterly audit; skipping validate; INDEX drift.

Details: [references/decision-tree.md](references/decision-tree.md) · [references/anti-patterns.md](references/anti-patterns.md)

### Cross-skill handoffs (summary)

- **`repo-tooling-pro`**, **`web-research-pro`**, **`git-operations-pro`**.

Details: [references/integration-map.md](references/integration-map.md)

### Versions (summary)

- `dist/tools.js` rebuild, Node alignment, upstream stack majors in logs.

Details: [references/versions.md](references/versions.md)

### Suggested response format (implement / review)

1. **Issue or goal** — Audit scope (whole bundle vs one skill) and **deadline** if any.
2. **Recommendation** — Command sequence: **`validate_skills`** → **`analyze_skills --self-review`** → authoring **checklist**; optional **`web-research-pro`** passes for **stack** skills; **activity log** / **INDEX** updates when decisions are saved.
3. **Code** — Pasted or summarized **Markdown report** + **table** of manual follow-ups — still labeled **Code**.
4. **Residual risks** — Heuristic blind spots, **stale** upstream docs if web research skipped, **INDEX** drift if docs added without update.

## Resources in this skill

- `references/` — report interpretation, authoring cross-check, tips, edge cases, Tier A maps; canonical commands in **`scripts/README.md`**.

| Topic | File |
|-------|------|
| `analyze_skills` report | [references/report-structure-and-scripts.md](references/report-structure-and-scripts.md) |
| Authoring cross-check | [references/authoring-rules-crosscheck.md](references/authoring-rules-crosscheck.md) |
| Tech refresh & web research | [references/tech-refresh-and-web-research.md](references/tech-refresh-and-web-research.md) |
| Tips | [references/tips-and-tricks.md](references/tips-and-tricks.md) |
| Edge cases | [references/edge-cases.md](references/edge-cases.md) |
| Decision tree | [references/decision-tree.md](references/decision-tree.md) |
| Anti-patterns | [references/anti-patterns.md](references/anti-patterns.md) |
| Integration map | [references/integration-map.md](references/integration-map.md) |
| Versions | [references/versions.md](references/versions.md) |
| **Script index** | [`scripts/README.md`](../../scripts/README.md) |

## Quick examples

**Input (simple):** “Give me a gap report before we tag v2.”  
**Expected output:** Run **`node dist/tools.js validate-skills`** (must pass); **`node dist/tools.js analyze-skills --self-review`**; summarize **actionable** tier (if any) + **tier distribution**; list **manual** §2 checks for skills touched in the PR.

**Input (tricky):** “Tier says we’re fine — merge.”  
**Expected output:** **Human** pass on **Related skills**, triggers, and **neutral** wording; heuristics **miss** nuance; do not override failing **`validate-skills`**.

**Input (cross-skill):** “Refresh Next.js skill from official docs and log it.”  
**Expected output:** **`web-research-pro`** for docs/changelog; **`skills-self-review-pro`** report shape; **`knowledge-base/documents/`** + **INDEX** + **activity-log** per persistence rules.

## Checklist before calling the skill done

- [ ] **`node dist/tools.js validate-skills`** outcome stated (pass / fail with paths).
- [ ] **`node dist/tools.js analyze-skills`** run with **documented** flags; **Markdown** or summary provided.
- [ ] **Authoring** checklist invoked for **structural** gaps, not only automation tiers.
- [ ] **Limits** of automation stated (**false positives** / **neutral** wording).
- [ ] If **tech refresh** was in scope: **`web-research-pro`** (or **Context7**) used for **official** sources; **activity-log** or **INDEX** updated when saving decisions.
- [ ] **`build-skill-index`** / **`build-kb`** follow-ups noted when content or KB docs changed.
- [ ] **Scope** respected — no unsolicited rewrite of untouched skills unless requested.
