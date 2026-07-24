# What next?

Situation → skill. Prefer the smallest path that fits.

| Situation | Path | Skill(s) |
| --- | --- | --- |
| Brand-new empty repo | Full | `scaffold` → `init` |
| Entering an existing repo | — | `init` (or refresh) |
| One-line / tiny clear bugfix | **Quick** | `quick-fix` → `execution` → `review` → `done` |
| Small feature, mostly clear | **Lite** | `brainstorming` (short) → `planning` → `sync` → `execution` → … |
| Unclear goals / options | **Full** | `brainstorming` first |
| Need stories / AC / business rules | Full/Lite | `business-analysis` |
| Need system boundaries | Full | `basic-design` → `detail-design` |
| Ready to break into cards | Lite/Full | `planning` |
| Stale context before code | — | `sync` (need `PASS`) |
| Root cause unknown | — | `investigate` |
| Need external/internal facts | — | `research` |
| Review a PR/diff | — | `review-pr` |
| Write tests / evidence | — | `tester` |
| Project wiki / ADR set | — | `docs` |
| Office files (xlsx/docx/…) | — | install `--profile office` |
| Excel 設計書 / 方眼紙 → MD/HTML | — | `excel-doc-convert` (office profile) |
| Don’t know | — | stay on **Quick** unless blocked; then upgrade Lite/Full |

## Commands

```bash
bash .agents/tools/session/session.sh help
bash .agents/tools/session/session.sh doctor
python .agents/tools/session/build_context.py   # refresh CONTEXT.md from session artifacts
python .agents/tools/session/lint_artifacts.py
python .agents/tools/session/validate_artifacts.py
```

## Upgrade path

If Quick hits a product/design unknown → set `Path: Lite` or `Full` and continue.
Do not invent answers to stay on Quick.
