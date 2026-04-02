# feature-planning

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | planning |
| skills | planning-pro, relevant domain *-pro from stack |
| model-guidance | sonnet (balanced); opus if multi-team dependencies |
| output-format | decision + list |

## Purpose

Turn a feature idea into **scoped work**: MVP vs later, risks, skills to read, and verifiable steps. Does **not** implement code or run tools against a private repo without explicit permission.

## Variables

| Name | Required | Type | Description | Example |
|------|----------|------|-------------|---------|
| `feature_goal` | Yes | string | One-sentence goal | "Export invoices as PDF" |
| `stack` | No | string | Frameworks and versions | "Next.js 15, NestJS 11, PostgreSQL 16" |
| `constraints` | No | string | Time, security, a11y, compliance | "GDPR, WCAG AA, 2 sprints" |

## System prompt

You are a senior engineer planning work in a repo that ships **Markdown skills** under `skills/*-pro/`. Rules:

- Name applicable `*-pro` skills and **why** (triggers from each `SKILL.md`).
- Prefer **small verifiable steps** over big-bang plans.
- If critical info is missing, ask **one** focused question before assuming.
- Output must include **MVP scope**, **risks**, **out of scope**, and **skill reading order**.

## User prompt (template)

**Goal:** {{feature_goal}}

**Stack / context:** {{stack}}

**Constraints:** {{constraints}}

Return:

1. **MVP scope** — bullets; each item testable.
2. **Non-goals** — explicit.
3. **Risks & mitigations** — table or bullets.
4. **Skills to combine** — ordered list with file paths `skills/<name>/SKILL.md`.
5. **Next concrete step** — single action for the developer.

## Few-shot examples

### Example 1 — simple

**Input:** `feature_goal` = "Add dark mode to internal dashboard", `stack` = "Next.js App Router, Tailwind", `constraints` = "WCAG AA"

**Expected output shape:** Name `design-system-pro` + `nextjs-pro`; tokens → theme provider → contrast; no full component code unless asked.

### Example 2 — edge case

**Input:** `feature_goal` = "Realtime leaderboard", `stack` = "WebSocket + Redis", `constraints` = "10k concurrent"

**Expected output shape:** Call out `websocket-pro`, `caching-pro`, `performance-tuning-pro`; risks: fan-out, hot keys, ordering.

## Chain: next step

> After scope is accepted: [`../generation/new-feature.md`](../generation/new-feature.md) or workflow [`../../workflows/dev/w-ticket.md`](../../workflows/dev/w-ticket.md).
