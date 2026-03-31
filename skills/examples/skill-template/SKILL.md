---
name: skill-template
description: |
  Template skill to copy. Replace name/description with concrete values.
  The description must state WHEN the skill applies (keywords, context, example questions).
metadata:
  short-description: Template skill — copy and rename
---

# Skill name (replace with yours)

## When to use

- Scenario 1: …
- Scenario 2: …
- Trigger keywords: `…`, `…`

## Workflow

1. Gather input / confirm the goal
2. …
3. Return output in the chosen format

## Resources in this skill (optional)

- `references/` — long-form docs; read only when needed (API, policy, schema)
- `scripts/` — deterministic commands (Python/bash)
- `assets/` — output attachments (HTML templates, logos, …)

## Quick example

**Input:** …  
**Expected output:** …

## Checklist before calling the skill done

- [ ] Frontmatter `description` is specific enough for the agent to know when to trigger
- [ ] Reference material is not pasted wholesale here — move it to `references/`
- [ ] Tried with 1–2 real prompts
