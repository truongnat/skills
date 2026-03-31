# AGENTS — hints for Cursor / agent tools

## Skills

Cursor loads skills from your IDE config (often `.cursor/skills` or project rules). You can:

- **Copy** a skill from `skills/<name>/` or `skills/examples/skill-template/` into your IDE’s skills folder; or
- **Symlink** (Unix): `ln -s "$(pwd)/skills/my-skill" ~/.cursor/skills/my-skill`

Bundled examples: `skills/react-pro/` (React web), `skills/nextjs-pro/` (Next.js), `skills/react-native-pro/` (React Native), `skills/flutter-pro/` (Flutter), `skills/nestjs-pro/` (NestJS), `skills/postgresql-pro/` (PostgreSQL), `skills/testing-pro/` (testing & automation), `skills/security-pro/` (cross-platform security), `skills/electron-pro/` (Electron), `skills/tauri-pro/` (Tauri), `skills/deployment-pro/` (deployment & release), `skills/seo-pro/` (SEO), `skills/design-system-pro/` (design system & UI/UX), `skills/mobile-design-pro/` (mobile UX).

Each skill needs a `SKILL.md` with clear frontmatter `name` and `description`.

**New skills:** read [`skills/SKILL_AUTHORING_RULES.md`](skills/SKILL_AUTHORING_RULES.md) first. Do not create a new skill directory unless those mandatory rules are met. When you add, remove, or rename a bundled skill, update **§8** there (README files, **§1** list, **`knowledge-base/documents/repo/skills-layout.md`**) in the same change.


## Knowledge base

Agents should prefer:

1. Read `knowledge-base/INDEX.md` to locate documents.
2. Open `.md` files under `knowledge-base/documents/` for detail.
3. For semantic search over the indexed corpus, run `python scripts/query_kb.py "…"` (after `build_kb`).

## Workflows

Read `.md` files under `workflows/examples/` or your own workflows; execute steps under **Steps**.

## Configuration

Edit `config.md` (copy from `config.example.md`) — the `kb-config` block in Markdown, not `.yaml`.
