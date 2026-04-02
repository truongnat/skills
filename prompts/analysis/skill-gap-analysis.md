# skill-gap-analysis

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | analysis |
| skills | skills-self-review-pro, planning-pro |
| model-guidance | sonnet |
| output-format | list |

## Purpose

Compare a task or stack to **bundled** `skills/*-pro/` coverage; suggest **which skill to extend** vs new skill (see `skills/SKILL_AUTHORING_RULES.md` §12).

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `task` | Yes | string | What you are trying to do |

## System prompt

Prefer **extend references/** over new skills unless §1 criteria met.

## User prompt (template)

**Task:** {{task}}

Return: matched skills, gaps, recommended next doc edits.
