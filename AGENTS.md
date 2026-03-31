# AGENTS — hints for Cursor / agent tools

## Skills

Cursor loads skills from your IDE config (often `.cursor/skills` or project rules). You can:

- **Copy** a skill from `skills/<name>/` or `skills/examples/skill-template/` into your IDE’s skills folder; or
- **Symlink** (Unix): `ln -s "$(pwd)/skills/my-skill" ~/.cursor/skills/my-skill`

Bundled examples: `skills/react-pro/` (React web), `skills/nextjs-pro/` (Next.js), `skills/react-native-pro/` (React Native), `skills/flutter-pro/` (Flutter), `skills/javascript-pro/` (JavaScript architecture, tips/tricks, edge cases), `skills/performance-tuning-pro/` (performance tuning, profiling, bottlenecks, edge cases), `skills/clean-code-architecture-pro/` (clean code and clean architecture practices), `skills/cli-pro/` (CLI design, exit codes, pipes, completions), `skills/api-design-pro/` (API design, contract evolution, idempotency, edge cases), `skills/graphql-pro/` (GraphQL schema design, resolvers, performance, security), `skills/websocket-pro/` (WebSocket reliability, lifecycle, scaling, security), `skills/microservices-pro/` (microservices boundaries, communication, resilience, operations), `skills/stream-rtc-pro/` (stream/RTC signaling, media QoS, scaling, security), `skills/nestjs-pro/` (NestJS), `skills/postgresql-pro/` (PostgreSQL), `skills/sql-data-access-pro/` (SQLite, SQL access), `skills/testing-pro/` (testing & automation), `skills/security-pro/` (cross-platform security), `skills/electron-pro/` (Electron), `skills/tauri-pro/` (Tauri), `skills/deployment-pro/` (deployment & release), `skills/seo-pro/` (SEO), `skills/design-system-pro/` (design system & UI/UX), `skills/mobile-design-pro/` (mobile UX), `skills/business-analysis-pro/` (business analysis), `skills/content-analysis-pro/` (docs, images, video analysis), `skills/data-analysis-pro/` (EDA, pandas, spreadsheets), `skills/image-processing-pro/` (Pillow, raster), `skills/web-research-pro/` (sources, citations), `skills/market-research-pro/` (market sizing, competitors, positioning), `skills/strategic-consulting-pro/` (strategy options, prioritization, scenarios), `skills/code-packaging-pro/` (pyproject, Docker, Actions), `skills/git-operations-pro/` (Git, PRs), `skills/skills-self-review-pro/` (skill bundle audit, gap reports), `skills/bug-discovery-pro/` (bug discovery, GitNexus), `skills/repo-tooling-pro/` (repo scripts, KB batch, `analyze_skills` report).

Each skill needs a `SKILL.md` with clear frontmatter `name` and `description`.

**New skills:** read [`skills/SKILL_AUTHORING_RULES.md`](skills/SKILL_AUTHORING_RULES.md) first. Do not create a new skill directory unless those mandatory rules are met. When you add, remove, or rename a bundled skill, update **§8** there (README files, **§1** list, **`knowledge-base/documents/repo/skills-layout.md`**) in the same change.


## Prompt routing (Claude Code slash commands)

Use these commands to analyze, optimize, and route prompts to the best skills:

| Command | Purpose |
|---------|---------|
| `/route <prompt>` | Full pipeline: analyze + optimize + match skills + suggest workflow |
| `/optimize <prompt>` | Reduce prompt tokens while preserving meaning |
| `/find-skill <prompt>` | Find best matching skill(s) for a prompt |
| `/run-workflow <prompt>` | Match prompt to workflows and skills, guide execution |

Commands read from `knowledge-base/embeddings/skill_index.json`. Rebuild after adding/changing skills:

```bash
python scripts/build_skill_index.py
```

## Knowledge base

Agents should prefer:

1. Read `knowledge-base/INDEX.md` to locate documents.
2. Open `.md` files under `knowledge-base/documents/` for detail.
3. For semantic search over the indexed corpus, run `python scripts/query_kb.py "…"` (after `build_kb`).
4. **Persist** meaningful decisions and audit outcomes under `knowledge-base/documents/` (see **`.cursor/rules/documentation-persistence.mdc`**, [`documents/repo/activity-log.md`](knowledge-base/documents/repo/activity-log.md)); update **INDEX** when adding files.

## Workflows

Read `.md` files under `workflows/examples/` or your own workflows; execute steps under **Steps**.

## Configuration

Edit `config.md` (copy from `config.example.md`) — the `kb-config` block in Markdown, not `.yaml`.

## Formatting (common)

- Repo root **`.editorconfig`** — UTF-8, LF, indent; Cursor rule **`.cursor/rules/formatting-common.mdc`** applies to all edits unless a narrower rule overrides.

## Bundle audit

- **`python scripts/analyze_skills.py --self-review`** — full Markdown report for this repo (skills + manual checklist). Pair with **`skills/skills-self-review-pro/`** and **`python scripts/validate_skills.py`**.
