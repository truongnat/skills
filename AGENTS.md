# AGENTS — hints for Cursor / agent tools

## Skills

Cursor loads skills from your IDE config (often `.cursor/skills` or project rules). You can:

- **Copy** a skill from `skills/public/<name>/` or `skills/examples/skill-template/` into your IDE’s skills folder; or
- **Symlink** (Unix): `ln -s "$(pwd)/skills/public/my-skill" ~/.cursor/skills/my-skill`

Bundled examples: `skills/public/react-pro/` (React web), `skills/public/nextjs-pro/` (Next.js), `skills/public/react-native-pro/` (React Native), `skills/public/flutter-pro/` (Flutter), `skills/public/nestjs-pro/` (NestJS), `skills/public/postgresql-pro/` (PostgreSQL).

Each skill needs a `SKILL.md` with clear frontmatter `name` and `description`.

## Knowledge base

Agents should prefer:

1. Read `knowledge-base/INDEX.md` to locate documents.
2. Open `.md` files under `knowledge-base/documents/` for detail.
3. For semantic search over the indexed corpus, run `python scripts/query_kb.py "…"` (after `build_kb`).

## Workflows

Read `.md` files under `workflows/examples/` or your own workflows; execute steps under **Steps**.

## Configuration

Edit `config.md` (copy from `config.example.md`) — the `kb-config` block in Markdown, not `.yaml`.
