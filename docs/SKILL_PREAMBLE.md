# Shared skill preamble

First-party skills point here instead of pasting Language/Memory/Work blocks.
**Read this file fully** at the start of every first-party skill invocation —
before Purpose, Contract, or steps.

Installed path: `.agents/SKILL_PREAMBLE.md` (source: `docs/SKILL_PREAMBLE.md`).
Layout detail: `.agents/AGENT_WORK.md`.

## Language (do this first)

**Re-read `.agents/settings.yaml` now** — do not reuse a `language` value cached
earlier in this session. Write every saved artifact and reply in that `language`
(`en` or `vi`); keep code, identifiers, paths, commands, and template section
keys unchanged. If the user just edited settings, the freshly read value wins. A
direct instruction in the current user request overrides the file.

**Domain terms:** keep original product/spec identifiers (JP screen names, field
IDs, API paths) as-is. Do **not** invent bilingual ceremony or translate every
label into the prose language — explain in `language`, cite domain terms raw.

## Work layout (mandatory)

Simple Skills splits **Kit** and **Work**:

| Layer | Path | Contents |
| --- | --- | --- |
| Kit | `.agents/` | skills, tools, settings, policy (installer) |
| Work | `.agent-work/` | `sessions/` + `memory/` together (nested git) |

Rules:

1. Write lifecycle artifacts **only** under
   `.agent-work/sessions/<Task-N-…>/` — never under `.agents/`, temp, or cache.
2. Write durable lessons **only** under `.agent-work/memory/`.
3. Resolve the active session with:
   ```bash
   bash .agents/tools/session/session.sh current
   ```
   Create one with `session.sh new <slug>` (also ensures `.agent-work` + nested
   git). Progress: `session.sh status`.
4. Do **not** put task artifacts into `.agents/skills` or other kit paths.
5. Prefer the product root `.gitignore` to include `.agent-work/` so Work history
   stays in its nested git, not the product repo.

## Memory (read first)

Before framing, researching, deciding, designing, planning, investigating, or
writing durable docs, read `.agent-work/memory/INDEX.md` and open the entries
whose hook matches this task. Reuse prior decisions, gotchas, and conventions
instead of re-deriving them; if memory conflicts with current evidence, trust
current evidence and note the drift. If none apply, continue.
(Memory is written by `done` — the vital few only.)

Skills that only execute, sync, review, or test still obey Language and Work
layout. Memory is optional for those unless the task needs prior decisions.

## Thinking methods (session-wide — not titles)

**Vital few** and **5W1H** are methods for the whole session context. They are
**not** report section names.

- Use **vital few** to prioritize what actually changes the outcome (summaries,
  memory). Do not title anything `80/20` or brand the executive summary
  with a method suffix. Do not create a separate `OVERVIEW.md`.
- Use **5W1H** only when the problem is hard/unclear — apply it to the session
  goal and evidence, then fold answers into real sections. Do not stamp 5W1H
  tables, do not answer trivia, do not brand a heading `5W1H`.

Details: `.agents/AGENT_POLICY.md` → Thinking methods.

## Readable writing (mandatory — every artifact)

Readers must understand ~80%+ of the artifact on a **first pass** without
decoding jargon. If a teammate new to the task cannot act from it, rewrite.

**Do:**

1. Concrete names: file paths, API routes, table/field IDs, screen IDs,
   commands, ticket/AC IDs, exact error strings.
2. Short sentences. One claim per bullet. Tables for lists of facts.
3. Spec quality / Doc reality findings = **specific** finding + evidence path +
   verdict. Example: `FBD13001 Search ignores BaseCd — see api/… line 40 —
   Mismatch` — not “cần align architecture với domain”. When designing or
   investigating from docs: **ask** on Blocking mismatches (docs vs code /
   common vs 設計書 / stale wiki) before continuing.
4. Delete unused sections. Finished artifacts must not contain `_(TODO)_` or
   leftover template scaffolding.
5. Charts only when they change a decision; otherwise omit (no decorative
   placeholder Mermaid).

**Do not:**

1. Pad to fill the template. Empty honesty beats fake completeness.
2. Abstract filler: “leverage”, “align stakeholders”, “holistic approach”,
   “ensure consistency”, “optimize the flow” with no object.
3. Restate section titles as content (“This section covers feasibility…”).
4. Dump bilingual labels (JP/EN/VN) unless the **domain artifact** requires
   them; never invent translation noise for ceremony.
5. Answer method prompts (5W1H / vital-few) as trivia sections.
6. Narrate your process (“I will now analyze…”, “As an AI…”).

Self-check before saving: *Would I paste this into a PR for a busy reviewer?*
If no → cut half, name concrete things, move guesses to Unknowns.

## Scale (Quick / Lite / Full)

At task start, pick a path (see `.agents/AGENT_POLICY.md` → Scale & Quick path):

- **Quick** — tiny clear fix; skip BA/design/Spec matrices; still use TASK Dev context.
- **Lite** — small feature; short sections; optional skip design.
- **Full** — unclear product or multi-surface; full lifecycle.

Record the choice in DISCUSSION/PLAN Developer overview (`Path:`).
