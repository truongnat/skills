| Field | Value |
|-------|-------|
| title | Skills directory layout |
| summary | Flat `skills/` tree: one folder per bundled skill plus `examples/skill-template` |
| tags | repo, skills, convention |
| updated | 2026-03-31 |

# Skills directory layout (current)

All skills live directly under **`skills/`**. There is no `public/` vs `private/` split; add sensitive skills in a private fork or `.gitignore` if needed.

**Maintenance:** When bundled skills change, update this file in the **same change** as `skills/README.md` — see `skills/SKILL_AUTHORING_RULES.md` §8.

```
skills/
  README.md
  SKILL_AUTHORING_RULES.md
  examples/
    skill-template/
  react-pro/
  nextjs-pro/
  react-native-pro/
  flutter-pro/
  nestjs-pro/
  postgresql-pro/
  testing-pro/
  security-pro/
  electron-pro/
  tauri-pro/
  deployment-pro/
  seo-pro/
  design-system-pro/
  mobile-design-pro/
  business-analysis-pro/
  content-analysis-pro/
  data-analysis-pro/
  image-processing-pro/
  web-research-pro/
  code-packaging-pro/
  bug-discovery-pro/
  repo-tooling-pro/
```

Each skill requires **`SKILL.md`** with YAML frontmatter (`name`, `description`, optional `metadata.short-description`). Optional folders: `references/`, `scripts/`, `assets/`.

Cross-references between skills use sibling paths, e.g. from `nestjs-pro` to PostgreSQL RLS docs: `../postgresql-pro/references/row-level-security.md`.

For Cursor: copy or symlink `skills/<name>/` to `.cursor/skills/<name>/` (see project `AGENTS.md`).
