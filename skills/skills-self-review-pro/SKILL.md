---
name: skills-self-review-pro
description: |
  Self-review of the skills template: structured gap and improvement reports using repo scripts (analyze_skills Markdown output, validate_skills, list_skills), cross-checks against SKILL_AUTHORING_RULES.md, and clear limits of automation vs human judgment.

  Use this skill when the user wants a **periodic audit** of bundled skills, a **PR checklist** for skill changes, an **automation vs scripts** backlog, or asks to **find gaps** and **suggested improvements** without manually opening every `SKILL.md`.

  Use **with** **`repo-tooling-pro`** for script flags and CI wiring; **`git-operations-pro`** when the output becomes a **commit** or **PR** artifact. This skill (`skills-self-review-pro`) owns **review methodology and report shape**; scripts own **deterministic checks**.

  Triggers: "skill self review", "audit skills", "gap report", "improve bundled skills", "analyze_skills", "validate_skills inventory", "authoring checklist", "skill quality", "SKILL.md review".

metadata:
  short-description: Skills self-review — gap reports, authoring cross-check, script-backed audit
---

# Skills self-review (professional)

Use **`scripts/analyze_skills.py`**, **`validate_skills.py`**, and **`list_skills.py`** from **repo root** (see [`scripts/README.md`](../../scripts/README.md)); this skill encodes **how** to combine outputs into an **actionable** improvement narrative — not a substitute for reading **`SKILL_AUTHORING_RULES.md`**. Confirm **cwd** is repo root and **venv** active when running Python tools.

## Related skills (this repo)

| Skill | When to combine with `skills-self-review-pro` |
|-------|-----------------------------------------------|
| **`repo-tooling-pro`** | Exact CLI flags, **`query_kb`**, KB rebuild after doc edits |
| **`git-operations-pro`** | Attach report to **PR**, **conventional** commit for tooling changes |
| **`business-analysis-pro`** | Rare — only if review outputs must become **formal** backlog items |

**Boundary:** **`skills-self-review-pro`** = **meta** review of the skill bundle; domain **`react-pro`** etc. = **product** stack guidance.

## When to use

- **Before merge** of large skill additions — run **`validate_skills`** + **`analyze_skills --markdown`**.
- **Quarterly** or **milestone** hygiene — generate gap list for maintainers.
- **Onboarding** — explain how bundled skills are **checked** in this repo.
- Trigger keywords: `self review`, `gap report`, `analyze_skills`, `validate_skills`, `authoring`, …

## Workflow

1. Confirm **repo root**, **Python venv**, and whether to include **`--with-references`** / **`--only-actionable`** for **`analyze_skills`**.
2. Apply the principles and topic summaries below; open `references/` when you need depth; run scripts and paste or summarize **Markdown** output.
3. Respond using **Suggested response format**; note **heuristic** limits and **manual** checks still required.

### Operating principles

1. **Scripts first** — Deterministic checks (`validate_skills`) before subjective critique.
2. **Separate concerns** — **Automation/script** gaps (`analyze_skills`) vs **structure** (`SKILL_AUTHORING_RULES.md`) vs **content quality** (human).
3. **Actionable backlog** — Each gap: **owner**, **suggested fix** (link script, add workflow, edit `references/`).
4. **No scope creep** — Review does not **rewrite** unrelated skills in one pass unless user asked.
5. **Reproducible** — Save **`--markdown`** output next to PR or in **`knowledge-base/documents/`** if the team wants history (update **`INDEX.md`**).
6. **Honest limits** — Heuristics miss **neutral** wording and **duplicate** conceptual scope; **Related skills** tables need human read.

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

### Suggested response format (implement / review)

1. **Issue or goal** — Audit scope (whole bundle vs one skill) and **deadline** if any.
2. **Recommendation** — Command sequence: **`validate_skills`** → **`analyze_skills --markdown`** (with flags) → authoring **checklist** pass.
3. **Code** — Pasted or summarized **Markdown report** + **table** of manual follow-ups — still labeled **Code**.
4. **Residual risks** — Heuristic blind spots, **unread** `references/`, **policy** disagreements on when to add scripts.

## Resources in this skill

- `references/` — report interpretation, authoring cross-check, tips, edge cases; canonical commands in **`scripts/README.md`**.

| Topic | File |
|-------|------|
| `analyze_skills` report | [references/report-structure-and-scripts.md](references/report-structure-and-scripts.md) |
| Authoring cross-check | [references/authoring-rules-crosscheck.md](references/authoring-rules-crosscheck.md) |
| Tips | [references/tips-and-tricks.md](references/tips-and-tricks.md) |
| Edge cases | [references/edge-cases.md](references/edge-cases.md) |
| **Script index** | [`scripts/README.md`](../../scripts/README.md) |

## Quick example

**Input:** “Give me a gap report before we tag v2.”  
**Expected output:** Run **`validate_skills`** (must pass); **`python scripts/analyze_skills.py --with-references --markdown`**; summarize **strong/consider** rows; list **manual** §2 section-order checks for any skill touched last month.

## Checklist before calling the skill done

- [ ] **`validate_skills`** outcome stated (pass / fail with paths).
- [ ] **`analyze_skills`** run with **documented** flags; **Markdown** or summary provided.
- [ ] **Authoring** checklist invoked for **structural** gaps, not only automation tiers.
- [ ] **Limits** of automation stated (**false positives** / **neutral** wording).
