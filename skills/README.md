# skills

Each **skill** is a subdirectory with a required `SKILL.md` (frontmatter `name` and `description`). Optional: `references/`, `scripts/`, `assets/`.

## Before creating a new skill (mandatory)

1. Read **[SKILL_AUTHORING_RULES.md](SKILL_AUTHORING_RULES.md)** end-to-end.
2. Do **not** add a new folder under `skills/` unless every **mandatory** rule in that document is satisfied. If not, extend an existing `*-pro` skill or add `references/` instead.
3. Cursor: project rule **`.cursor/rules/skills-authoring.mdc`** applies when editing skills.

- **Template:** copy [`examples/skill-template/`](examples/skill-template/) and rename the folder; align with `SKILL_AUTHORING_RULES.md`.

## Bundled examples

| Directory | Description |
|-----------|-------------|
| [react-pro](react-pro/) | React (web) — components, hooks, UI/a11y, SSR, edge cases |
| [nextjs-pro](nextjs-pro/) | Next.js — App Router, RSC, caching, middleware |
| [react-native-pro](react-native-pro/) | React Native / Expo — UI/UX, performance, edge cases |
| [flutter-pro](flutter-pro/) | Flutter — Material 3, multi-platform edge cases |
| [nestjs-pro](nestjs-pro/) | NestJS — API/DX, PostgreSQL RLS integration |
| [postgresql-pro](postgresql-pro/) | PostgreSQL — schema, SQL, migrations, RLS, ops |
| [testing-pro](testing-pro/) | Testing & automation — pyramid, CI, unit/integration/e2e, flakiness |
| [security-pro](security-pro/) | Cross-platform security — threat model, auth, secrets, tips, edge cases |
| [electron-pro](electron-pro/) | Electron — main/preload/renderer, IPC, packaging, updates |
| [tauri-pro](tauri-pro/) | Tauri — Rust commands, capabilities, webview, bundle |
| [deployment-pro](deployment-pro/) | Deployment — methods, CI/CD flows, release strategies, rollback |

To use with Cursor: copy or symlink a skill folder into `.cursor/skills/<name>/` (see root [`AGENTS.md`](../AGENTS.md)).
