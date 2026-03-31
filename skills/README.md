# skills

Each **skill** is a subdirectory with a required `SKILL.md` (frontmatter `name` and `description`). Optional: `references/`, `scripts/`, `assets/`.

- **Template:** copy [`examples/skill-template/`](examples/skill-template/) and rename the folder.

## Bundled examples

| Directory | Description |
|-----------|-------------|
| [react-pro](react-pro/) | React (web) — components, hooks, UI/a11y, SSR, edge cases |
| [nextjs-pro](nextjs-pro/) | Next.js — App Router, RSC, caching, middleware |
| [react-native-pro](react-native-pro/) | React Native / Expo — UI/UX, performance, edge cases |
| [flutter-pro](flutter-pro/) | Flutter — Material 3, multi-platform edge cases |
| [nestjs-pro](nestjs-pro/) | NestJS — API/DX, PostgreSQL RLS integration |
| [postgresql-pro](postgresql-pro/) | PostgreSQL — schema, SQL, migrations, RLS, ops |

To use with Cursor: copy or symlink a skill folder into `.cursor/skills/<name>/` (see root [`AGENTS.md`](../AGENTS.md)).
