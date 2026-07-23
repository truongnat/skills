# Shared skill preamble

First-party skills point here instead of pasting Language/Memory blocks.
**Read this file fully** at the start of every first-party skill invocation —
before Purpose, Contract, or steps.

Installed path: `.agents/SKILL_PREAMBLE.md` (source: `docs/SKILL_PREAMBLE.md`).

## Language (do this first)

**Re-read `.agents/settings.yaml` now** — do not reuse a `language` value cached
earlier in this session. Write every saved artifact and reply in that `language`
(`en` or `vi`); keep code, identifiers, paths, commands, and template section
keys unchanged. If the user just edited settings, the freshly read value wins. A
direct instruction in the current user request overrides the file.

## Memory (read first)

Before framing, researching, deciding, designing, planning, investigating, or
writing durable docs, read `.agents/memory/INDEX.md` and open the entries whose
hook matches this task. Reuse prior decisions, gotchas, and conventions instead
of re-deriving them; if memory conflicts with current evidence, trust current
evidence and note the drift. If none apply, continue.
(Memory is written by `done` — the 80/20 vital few.)

Skills that only execute, sync, review, or test still obey Language. Memory is
optional for those unless the task needs prior decisions.
