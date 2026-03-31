| Field | Value |
|-------|-------|
| title | Skills directory layout |
| summary | Flat `skills/` tree: one folder per skill plus `examples/skill-template` |
| tags | repo, skills, convention |
| updated | 2026-03-31 |

# Skills directory layout (current)

All skills live directly under **`skills/`**. There is no `public/` vs `private/` split; add sensitive skills in a private fork or `.gitignore` if needed.

```
skills/
  README.md              # index of bundled examples
  examples/
    skill-template/      # copy to create a new skill
  react-pro/
  nextjs-pro/
  react-native-pro/
  flutter-pro/
  nestjs-pro/
  postgresql-pro/
```

Each skill requires **`SKILL.md`** with YAML frontmatter (`name`, `description`, optional `metadata.short-description`). Optional folders: `references/`, `scripts/`, `assets/`.

Cross-references between skills use sibling paths, e.g. from `nestjs-pro` to PostgreSQL RLS docs: `../postgresql-pro/references/row-level-security.md`.

For Cursor: copy or symlink `skills/<name>/` to `.cursor/skills/<name>/` (see project `AGENTS.md`).
