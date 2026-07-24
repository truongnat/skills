# Migration notes (agents + hosts)

Breaking or behavior changes hosts should know after reinstall.

## 2026-07 — Kit / Work + quality bar

| Change | Action on host |
| --- | --- |
| Artifacts moved `.agents/sessions|memory` → `.agent-work/` | Move old folders; run `session.sh set …`; ensure `.gitignore` has `.agent-work/` (installer appends) |
| `OVERVIEW.md` retired | Delete or ignore; progress = `TASKS.md` + `session.sh status` |
| Lean `settings.yaml` | Keep your knobs; decision/visual/comment matrices live in AGENT_POLICY defaults |
| TASK `#### Dev context` required | Re-run planning step-03 or fill Dev context before sync/`execution` |
| Sync **Implementation readiness** | `SYNC.md` needs heading; verdict `PASS`\|`CONCERNS`\|`FAIL` |
| New skill `quick-fix` | Use for tiny fixes; Path=Quick must not create BA/design |
| Quality lint | Run `lint_artifacts.py` before review/done (CI-style locally) |
| Docs `START_HERE` / `WHAT_NEXT` / `MIGRATION` | Installed under `.agents/` |
| Installer `doctor` / `uninstall` | `./install.sh doctor`; `./install.sh uninstall --yes` (optional `--purge-work`, `--keep-settings`) |
| CLI `sk` | PyPI `pipx install simple-skills` then `sk install` / `doctor` / `uninstall` (see README Publish) |
| Skill `excel-doc-convert` | Office profile: Excel 設計書/方眼紙 → HTML+MD + `convert-report.json` |
| Doc reality check | `investigate` / `basic-design` / `detail-design` must compare docs↔code and **stop and ask** on Blocking mismatches |

## How to upgrade a host project

```bash
# from cloned simple-skills
./install.sh --agents-mode replace   # or prompt
# then in the host project
./install.sh doctor
bash .agents/tools/session/session.sh doctor
python .agents/tools/session/lint_artifacts.py
```

Reinstall **preserves** `.agents/settings.yaml`. Policy/skills/tools refresh from the kit.

To remove the kit: `./install.sh uninstall --yes` (keeps `.agent-work/` unless `--purge-work`).
