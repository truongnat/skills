# Automation gap report (`analyze_skills`)

## What it measures

- **Signals:** Keywords suggesting CLI, CI, FFmpeg, shell, OCR, batch work.
- **Mitigation:** Mentions of `scripts/`, `query_kb`, `validate_skills`, `repo-tooling-pro`, `analyze_skills`, etc.
- **Tiers:** `strong` / `consider` / `low` / `ok` / `exempt` / `unknown`.

## How to run

```bash
# Full Markdown report (paste into PR or KB)
python scripts/analyze_skills.py --markdown

# Actionable only + richer signals from references/
python scripts/analyze_skills.py --with-references --only-actionable --markdown
```

## Interpreting gaps

| Tier | Typical action |
|------|----------------|
| **strong** | Add or link a helper under `scripts/`, or document repeatable commands in `SKILL.md`. |
| **consider** | If users repeat the same steps, add a workflow under `workflows/examples/` or a tiny script. |
| **ok** | Already references repo tooling — no automation gap from this heuristic. |
| **exempt** | `repo-tooling-pro` — meta skill. |

## Limits

- Does **not** check section order, frontmatter quality, or duplicate scope — use **`validate_skills`** + **`SKILL_AUTHORING_RULES.md`** for that.
