---
name: init
description: >-
  Initializes or refreshes project knowledge for all other skills. Use first
  when entering a project, when .agents/PRJ_REFERENCE.md is missing or stale,
  or when the user asks to force-regenerate project context and rules.
---

# Project Init

## Language (do this first)

**Re-read `.agents/settings.yaml` now** — do not reuse a `language` value cached
earlier in this session. Write every saved artifact and reply in that `language`
(`en` or `vi`); keep code, identifiers, paths, commands, and template section
keys unchanged. If the user just edited settings, the freshly read value wins. A
direct instruction in the current user request overrides the file.

## Purpose

Build a reliable project reference before other lifecycle skills run. Collect
facts from the repository, record sources and confidence, and configure
project-specific behavior without inventing conventions.

## Contract (mandatory)

| Field | Requirement |
|---|---|
| Inputs | Repository root, existing `.agents/settings.yaml` and `.agents/PRJ_REFERENCE.md` when present, source/config/docs/tests, git metadata, user-confirmed project rules. |
| Outputs | `.agents/PRJ_REFERENCE.md` and a merged `.agents/settings.yaml`. |
| Safety | Read-only discovery. Never read or record secret values. Never execute **project** code, install dependencies, or mutate source files. Running the bundled read-only `scripts/scan_workspaces.sh` (filesystem sweep only) is allowed. Preserve existing user settings unless explicitly replaced. Mark uncertain facts; do not invent business or workflow rules. |

### Required artifacts

#### `.agents/PRJ_REFERENCE.md`

- Required: yes.
- **executive_summary**: The most useful 20% of project context.
- **project_identity**: Purpose, users, domain, lifecycle status.
- **workspaces**: For a monorepo, one row per app/package/service with its
  path, type, and its **own** stack, entry point, and commands. Never collapse
  a multi-stack monorepo into a single root stack.
- **tech_stack**: Languages, frameworks, runtime, package/build tools. In a
  monorepo, record the stack **per workspace** (see `workspaces`), not only the
  root manifest.
- **architecture**: Components, boundaries, entry points, data flows.
- **business_rules**: Rule, source, affected area, confidence.
- **key_constraints**: Technical, business, compliance, compatibility.
- **commands**: Setup, build, test, lint, run, migration commands.
- **conventions**: Code, branch, commit, PR, reporting, decision-gate, and visual conventions.
- **security_notes**: Security boundaries and handling rules, without secrets.
- **references**: Authoritative file/path/URL references.
- **unknowns**: Missing or conflicting information requiring confirmation.
- **freshness**: Generated/updated time, source commit, mode.

#### `.agents/settings.yaml`

- Required: yes; merge in place.
- Preserve `language` and any user-authored values.
- Populate only repository-evidenced or user-confirmed project rules.
- Do not copy descriptive project facts here; link to
  `.agents/PRJ_REFERENCE.md`.

## Modes

| Mode | Use | Behavior |
|---|---|---|
| `init` | Reference is missing | Create from the template. |
| `refresh` | Existing reference may be stale | Update changed facts and preserve confirmed content. |
| `force` | User explicitly requests regeneration | Re-scan all sources and rebuild the reference; merge settings without silently resetting user choices. |

## Workflow (step by step)

1. Read `.agents/settings.yaml` and existing project reference, if any.
2. Select mode: `init`, `refresh`, or explicit `force`.
3. Inventory repository facts using read-only inspection:
   - git root, remotes (redact credentials), branches, default/base branch;
   - manifests, lockfiles, build/test/lint configs, CI, containers, migrations;
   - source layout, entry points, public interfaces, tests, documentation;
   - business rules and constraints evidenced by docs, tests, schemas, or code.
4. **Deep workspace scan (mandatory — do not scan only the root, and do not
   enumerate from the workspace config).** Run the bundled deterministic
   scanner, which sweeps the **filesystem** for every project manifest across
   all ecosystems — independent of any JS/TS workspace config:

   ```bash
   bash .agents/skills/init/scripts/scan_workspaces.sh
   ```

   It prints one `DIR<TAB>STACK<TAB>MANIFEST` row per project (Node/TS,
   Flutter/Dart, Go, Rust, Python, JVM, .NET, PHP, Ruby, Swift, …).
   - **Record every row.** Each row with a manifest of a different ecosystem is
     a distinct stack that MUST appear in the `workspaces` table and in
     per-workspace `tech_stack`.
   - **Why the config is not enough:** a `pnpm-workspace.yaml` / `turbo.json` /
     root `package.json "workspaces"` lists only JS/TS members. A Flutter/Dart,
     Go, Rust, or Python app under `apps/` is typically **not** listed there, so
     enumerating from the config silently drops whole stacks. The script is the
     source of truth for enumeration; the config is only supporting evidence.
   - For each detected project, read its own manifest for the entry point and
     per-app commands, and record path, type, stack, entry point, and commands.
   - If the script cannot run in this environment, fall back to a manual
     recursive manifest sweep (`package.json`, `pubspec.yaml`, `Cargo.toml`,
     `go.mod`, `pom.xml`, `build.gradle*`, `pyproject.toml`, `*.csproj`, …)
     while pruning `node_modules`, build/generated, and native platform dirs —
     never bound the sweep by the workspace config.
6. Classify every important statement:
   - `confirmed`: direct source or user confirmation;
   - `inferred`: evidence exists but is indirect;
   - `unknown`: unresolved or conflicting.
7. Seed from `templates/PRJ_REFERENCE.template.md`, fill all applicable
   sections, and keep source references close to each fact.
8. Merge confirmed project conventions into `.agents/settings.yaml`.
   Preserve `language`, security hard rules, and custom user values.
9. Validate:
   - no secret values or sensitive file contents;
   - executive summary appears first and is decision-oriented;
   - commands are sourced, not guessed;
   - every workspace member with its own manifest has its own stack recorded
     (no multi-stack monorepo collapsed to a single root stack);
   - unknowns and conflicts are visible.
10. Report created/updated files and the highest-priority unknowns.

## Discovery boundaries

Do not open `.env`, credential stores, private keys, production dumps, or
secret-manager payloads. File names may be listed when needed; values must
never be read or copied.

## Handoff

All subsequent skills must read `.agents/settings.yaml` and
`.agents/PRJ_REFERENCE.md` before making project-specific decisions. If the
reference is missing or materially stale, run this skill first.
