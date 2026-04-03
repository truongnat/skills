# Slash commands (source of truth)

Workflow and routing command stubs for **Cursor** and **Claude Code** live here as a **single copy**. IDE-specific paths under [`.cursor/commands/`](../.cursor/commands/) and [`.claude/commands/`](../.claude/commands/) are **symlinks** into this directory for local development.

## Frontmatter

Each file may declare where it is deployed when running the installer:

```yaml
---
targets:
  - cursor
  - claude
---
```

Default when omitted: both `cursor` and `claude`. Claude-only helpers (e.g. `/route`) use `targets: [claude]` only.

The full bundle install syncs the repo to **`.agents/devkit/`** and symlinks from here into the consumer project’s `.cursor/commands/` and `.claude/commands/` per `targets`.
