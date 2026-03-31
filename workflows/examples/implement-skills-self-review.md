# Workflow: implement-skills-self-review

Run a **script-backed** gap report and **authoring** cross-check on the bundled skill tree using **`skills-self-review-pro`** and **`repo-tooling-pro`**.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-skills-self-review` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `scope` | No | `full` (default) or list of skill folder names |
| `include_template` | No | Whether to include `examples/skill-template` |

## Outputs

| Variable | Description |
|----------|-------------|
| `validation` | Result of `validate_skills` |
| `report_md` | `analyze_skills --markdown` body or path |
| `manual_followups` | Items from `SKILL_AUTHORING_RULES.md` not covered by scripts |

## Steps

### Step 1 — `validate`

- **Type:** skill
- **Skill:** `repo-tooling-pro`
- **Input:** run **`python scripts/validate_skills.py`** from repo root
- **Output:** `validation` — must pass before treating bundle as clean

### Step 2 — `automation-gaps`

- **Type:** skill
- **Skill:** `skills-self-review-pro`
- **Input:** `include_template` → pass **`--include-template`** if true; prefer **`--with-references --markdown`**
- **Output:** `report_md` — [references/report-structure-and-scripts.md](../../skills/skills-self-review-pro/references/report-structure-and-scripts.md)

### Step 3 — `authoring-crosscheck`

- **Type:** skill
- **Skill:** `skills-self-review-pro`
- **Input:** `report_md` + **`skills/SKILL_AUTHORING_RULES.md`**
- **Output:** `manual_followups` — [references/authoring-rules-crosscheck.md](../../skills/skills-self-review-pro/references/authoring-rules-crosscheck.md)
