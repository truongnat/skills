# Skill authoring rules (mandatory)

**Do not create a new skill directory under `skills/` unless every mandatory rule below is satisfied.**  
If a proposed skill cannot meet these rules, **stop** — extend an existing `*-pro` skill or update `references/` instead.

## 1. When you may add a new skill

- [ ] The topic is **not** already covered by an existing bundled skill (`react-pro`, `nextjs-pro`, `react-native-pro`, `flutter-pro`, `nestjs-pro`, `postgresql-pro`, `sql-data-access-pro`, `testing-pro`, `security-pro`, `electron-pro`, `tauri-pro`, `deployment-pro`, `seo-pro`, `design-system-pro`, `mobile-design-pro`, `business-analysis-pro`, `content-analysis-pro`, `data-analysis-pro`, `image-processing-pro`, `web-research-pro`, `code-packaging-pro`, `git-operations-pro`, `bug-discovery-pro`, `repo-tooling-pro`).
- [ ] The topic is **distinct** enough that merging into an existing skill would blur scope (document the reason in the PR or commit message).
- [ ] You have (or will add) at least **`SKILL.md`** and, for non-trivial domains, a **`references/`** folder — not a dump of all docs inside `SKILL.md`.

## 2. Canonical `SKILL.md` structure (required order)

Use exactly these section headings and order. Omit **optional** sections only when not applicable.

| Order | Section | Required |
|-------|---------|----------|
| — | YAML frontmatter (`name`, `description`, `metadata.short-description`) | **Yes** |
| 1 | `# <Display name> (professional)` | **Yes** |
| 2 | Intro paragraph (see §3) | **Yes** |
| 3 | `## Related skills (this repo)` | **Optional** — only if the skill regularly defers to or combines with other `*-pro` skills (table: Skill \| When to combine). |
| 4 | `## When to use` | **Yes** — bullets + final bullet `- Trigger keywords: ...` |
| 5 | `## Workflow` | **Yes** — exactly **three** numbered steps (see §4), then subsections |
| 6 | `### Operating principles` | **Yes** — numbered list |
| 7 | `### <Topic> (summary)` | **Yes** — one or more; each ends with `Details: [references/....md](references/....md)` if a reference file exists |
| 8 | `### Suggested response format (implement / review)` | **Yes** — four items: **Issue or goal**, **Recommendation**, **Code**, **Residual risks** |
| 9 | `## Resources in this skill` | **Yes** — short intro line + table **Topic \| File** |
| 10 | `## Quick example` | **Yes** — **Input:** and **Expected output:** |
| 11 | `## Checklist before calling the skill done` | **Yes** — `- [ ]` items |

## 3. Frontmatter and intro

- **`name`**: kebab-case, matches folder name (e.g. `folder: react-pro` → `name: react-pro`).
- **`description`**: First line = one-sentence professional scope. Then `Use this skill when ...`. Then `Triggers:` line with quoted keywords where helpful. For cross-cutting skills, add a line on **which existing skills** to combine with.
- **`metadata.short-description`**: One line; pattern `Product — areas, comma-separated`.
- **Intro paragraph** (after H1): Name **primary official docs** (link); state what this skill **encodes** (bold phrases); state what to **confirm** from the project (versions, environment).

## 4. Workflow — three fixed steps

Use this wording unless a domain needs a single extra clause in step 1 (keep steps 2–3 identical):

1. **Confirm** versions / environment / stack (skill-specific).
2. **Apply the principles and topic summaries below; open `references/` when you need depth.** (You may add a short clause after the semicolon, e.g. “for RLS, combine with `postgresql-pro`”.)
3. **Respond using **Suggested response format**;** note the main risks (skill-specific).

## 5. Suggested response format — four fixed labels

Always use these labels (bold in markdown):

1. **Issue or goal**
2. **Recommendation**
3. **Code** — (SQL, snippets, YAML, or checklist — still labeled **Code** for consistency)
4. **Residual risks**

Do not use **Artifacts** or **Goal** alone as a section title here.

## 6. References

- Long content lives under **`references/*.md`**.
- Prefer filenames used elsewhere: **`tips-and-tricks.md`**, **`edge-cases.md`**, plus domain-specific names.
- `SKILL.md` only holds summaries; each summary block points to one `references/` file with `Details: ...`.

## 7. Copy procedure

1. Copy `skills/examples/skill-template/` → `skills/<new-skill-name>/`.
2. Replace placeholders following this document.
3. Run through the **checklist** in the template `SKILL.md`.
4. Complete **§8** for the same trigger (do not stop at `SKILL.md` only).

## 8. Mandatory repository documentation (required with the same change)

When you **add**, **remove**, or **rename** a bundled skill, or **add** a workflow under `workflows/examples/`, or **add** a new file under `knowledge-base/documents/`, update **every** applicable item below in the **same PR or commit** as the skill/workflow/KB change.

| Trigger | Required updates |
|---------|------------------|
| **Add** a bundled skill (`skills/<name>/`) | `skills/README.md` (table row); root **`README.md`** (Skills → Bundled examples); **`AGENTS.md`** (Bundled examples line); **§1** above (parenthesized skill list); **`knowledge-base/documents/repo/skills-layout.md`** (tree or folder list must include the new skill) |
| **Remove** or **rename** a bundled skill | Same locations: delete or fix all mentions; **§1** list; **`skills-layout.md`** |
| **Add** a workflow under `workflows/examples/` | Root **`README.md`** (Workflows → Examples list) |
| **Add** a new document under `knowledge-base/documents/**` | **`knowledge-base/INDEX.md`** (new row with path and short description) |

**Rationale:** Discovery for humans and agents depends on **`README.md`** / **`AGENTS.md`**; **§1** avoids duplicate skill proposals; **`skills-layout`** is indexed for RAG and must reflect the real tree.

## 9. Review

Before merge: section order matches §2; Workflow steps match §4; Suggested response labels match §5; no duplicate scope with existing skills without **Related skills** table explaining boundaries; **§8** is satisfied for any trigger in this change.
