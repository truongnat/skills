---
name: scaffold
description: >-
  Bootstrap a brand-new (greenfield) project from zero — stack, structure,
  tooling, repo, and .agents/ wiring — with decisions recorded, ready for the
  lifecycle. Use before init when there is no code yet. (Hard contract in this
  SKILL.md — MUST follow.)
---

# Scaffold (new project bootstrap)

## Shared preamble (do this first)

Read and follow `.agents/SKILL_PREAMBLE.md` now (Language + Memory) before
Purpose, Contract, or steps. Do not skip it; do not reuse a cached `language`
from earlier in the session. Source copy in this repo: `docs/SKILL_PREAMBLE.md`.

## Purpose

Turn an empty (or nearly empty) directory into a working project **skeleton** —
the greenfield counterpart to `init` (which only reads an existing repo). It
picks a stack, lays out the structure, wires tooling (lint/format/test/CI),
initializes the repo and the `.agents/` workflow, records the stack decisions,
then hands off to the lifecycle for real features.

It **creates files** (unlike the read-only `init`). It does **not** invent
requirements — direction comes from `DISCUSSION.md`/`BUSINESS_ANALYSIS.md` when
present, otherwise from focused questions.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | Target directory, user intent, `DISCUSSION.md`/`BUSINESS_ANALYSIS.md` when present, `.agents/settings.yaml` (language, branch, code, docs), `.agents/memory/`, stack/tooling choices (confirmed). |
| Outputs | Project skeleton (structure, manifests, tooling config, base entry points, README/.gitignore/.env.example), initialized repo + `.agents/` (settings, memory, optional wiki scaffold), stack ADRs, and `SCAFFOLD.md` in the active session. |
| Safety | Greenfield only — **never scaffold over an existing project**; if manifests/source exist, stop and route to `init`. Do NOT overwrite existing files without confirmation. Do NOT install dependencies or run project code unless the user approves (default: print the commands, don't run). Do NOT invent versions/secrets — use known-stable or ask, and mark assumptions. Respect `rules.branch.mode`. |

### Greenfield guard (before writing anything)
- Detect existing project: run `bash .agents/skills/init/scripts/scan_workspaces.sh`.
  If it surfaces real manifests/source, this is **not** greenfield — stop and
  recommend `init` (+ lifecycle) instead of scaffolding.
- If the directory is non-empty but has no project, list what is there and ask
  before writing.

### Required artifacts
- **Project skeleton** at the repo/target root (the deliverable):
  - Directory layout for the chosen architecture (monorepo `apps/`+`packages/`,
    or single package) with base entry points / a minimal runnable "hello".
  - Package/build manifests with real **scripts** (`build`, `test`, `lint`,
    `run`) sourced from the stack's conventions.
  - Tooling config: formatter, linter, test runner, and a CI workflow (reuse
    `github-actions-templates` when applicable).
  - `README.md` (how to run), `.gitignore`, `.editorconfig`, `.env.example`.
  - Code follows `.agents/CODE_COMMENTS.md`.
- **`.agents/` wiring:** ensure `settings.yaml` (from template), `memory/`, and
  — if `rules.docs.enabled` — an initial wiki scaffold (`docs full` skeleton).
- **Stack ADRs:** one ADR per significant choice (language/framework, monorepo
  tool, package manager, test framework, CI) using the `docs` ADR template.
- **`SCAFFOLD.md`** in the active session (see template): what was created,
  decisions, assumptions/gaps, and the exact next commands.

## Workflow (step by step)

1. Resolve the active session: `bash .agents/tools/session/session.sh current`
   (or `new <slug>`); write `SCAFFOLD.md` there. Read settings (language,
   branch, code, docs).
2. **Greenfield guard** (above). Stop/route to `init` if not greenfield.
3. Resolve intent & stack: prefer `DISCUSSION.md`/`BUSINESS_ANALYSIS.md`; for
   anything unknown ask **focused** questions (≤3 at a time): project type,
   language/framework, monorepo vs single, package manager, test framework, CI,
   license. Record each decision as an ADR (do not silently default).
4. Choose the architecture skeleton (layout, layering, naming). Keep it minimal
   and idiomatic for the stack — no speculative structure.
5. Create the skeleton: directories, manifests + scripts, tooling config, CI,
   README/.gitignore/.editorconfig/.env.example, and a minimal runnable entry.
   Do not overwrite existing files; never write real secrets.
6. Branch per `rules.branch.mode`: `direct` → stay on the base branch;
   `checkout` → create the initial work branch before writing code files. Run
   `git init` if there is no repo.
7. Wire `.agents/`: seed `settings.yaml` if missing; ensure `memory/`; if
   `rules.docs.enabled`, produce the initial wiki via `docs full`.
8. Write the stack ADRs and `SCAFFOLD.md` (created files, decisions, assumptions
   marked, and the exact next commands — install/build/run — as text; run them
   only if the user approves).
9. Handoff: run `init` to generate `PRJ_REFERENCE.md` from the new skeleton,
   then the lifecycle (`brainstorming`/`planning`) for the first feature.

## Quality Standards

- [ ] Greenfield guard ran; existing projects are routed to `init`, not scaffolded over.
- [ ] Stack/tooling choices are confirmed (from artifacts or user), each an ADR — not silently defaulted.
- [ ] Manifest scripts (build/test/lint/run) are real and sourced from the stack, not guessed.
- [ ] A minimal runnable entry exists; README states how to run it.
- [ ] `.agents/` wired (settings, memory, wiki when enabled); branch per `rules.branch.mode`.
- [ ] No dependencies installed / code run without approval; no invented versions/secrets (assumptions marked).
- [ ] `SCAFFOLD.md` lists created files, decisions, gaps, and the exact next commands.
- [ ] Handoff names `init` then the next lifecycle skill.

## Reference

`agents/openai.yaml` mirrors this contract for tooling. This SKILL.md is authoritative.

## Limitations

- Does NOT design features or write business logic (that is the lifecycle).
- Does NOT replace `init` — it precedes it for greenfield, then hands off.
- Does NOT install dependencies or deploy; it prepares and prints the commands.
