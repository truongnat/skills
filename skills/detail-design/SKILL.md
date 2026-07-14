---
name: detail-design
description: "Produce implementable design from BASIC_DESIGN.md — contracts, data model, sequences, rules, operations, client mapping when needed — before planning. Domain-agnostic; omit unused sections. (Hard contract in this SKILL.md — MUST follow.)"
---

# Detail Design

## Purpose

Turn BASIC_DESIGN.md into implementable specs: how in-scope parts fulfill the approved boundaries.

This skill focuses on:

- Contracts for in-scope surfaces (HTTP, RPC, events, CLI, library APIs — whichever applies).
- Data model at key-field level with known/inferred confidence.
- Sequences for the main happy path plus 1–2 error paths when errors matter.
- Validation and rules at design level.
- Structured operations/queries when data access matters (base source, joins/links, filters with operators, sort/group).
- Client or presentation mapping when a consumer UI/CLI/SDK is in scope.
- Error and state handling for callers.
- Optional persistence write-spec and field provenance when outputs or stores need them.
- Traceability to BR/AC when business-analysis exists.
- Explicit gaps when sources are incomplete.
- Handoff to planning (not execution).

The goal: give planning enough precision without inventing architecture or a fixed product domain.

## Dynamic depth

- Include only sections that apply; omit the rest (no forced N/A blocks).
- Prefer structured lists/tables over prose for contracts, operations, and rules.
- Mark every uncertain field or join as inferred (never as known fact).
- If a needed input is missing, list it under `gaps` and do not invent.
- Multi-surface work: one DETAIL_DESIGN with sections per surface, or linked child notes — stay consistent with BASIC surfaces.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | BASIC_DESIGN.md (required); DISCUSSION.md and business-analysis notes for AC/BR traceability when available. |
| Outputs | DETAIL_DESIGN.md with goal, applicable contracts/models/sequences/rules/operations, optional client mapping and persistence, errors/states, gaps, assumptions, handoff to planning. Omit unused sections. |
| Safety | Do NOT implement code. Do NOT expand scope beyond BASIC_DESIGN.md. Do NOT invent fields or joins as facts — mark inferred. Do NOT force UI-only or domain-specific sections. Do NOT create PLAN.md, task IDs, DoD, or rollback. |

### Required artifacts

#### `DETAIL_DESIGN.md`
- Required: yes
- **goal** (required, string): One sentence linked to basic-design decisions.
- **contracts** (optional, array): In-scope contracts: HTTP/RPC/events/CLI/library APIs with inputs, outputs, and errors. Omit if no external or public surface.
- **data_model** (optional, array): Entities/collections, key fields, relations; confidence known or inferred. Omit if no durable data.
- **sequences** (required, array): Main happy path plus 1–2 error paths when errors matter.
- **rules_and_validation** (optional, array): Validation and business-rule application at design level (when, condition, severity or outcome).
- **operations** (optional, array): Structured data/ops access when relevant: base source, joins/links, filters with operators, sort/group, projections.
- **client_mapping** (optional, array): Consumer mapping when UI/CLI/SDK is in scope: inputs/views → contract fields; optional initial state and interaction steps.
- **persistence_spec** (optional, array): Write/update behavior when stores change; or state read-only. Omit if no persistence side effects.
- **field_provenance** (optional, array): When outputs or views need it: display/export field → source field/entity + confidence.
- **error_and_state_handling** (required, array): Error codes/states and how callers or clients should behave.
- **gaps** (optional, array): Missing inputs or undecided details that block or soften the design. Do not invent to fill these.
- **traceability** (optional, array): BR/AC IDs mapped to design sections when BA exists.
- **assumptions** (required, array): Assumptions with risk and confirmation status.
- **handoff** (required, string): Suggested next skill: planning. Call out blocking items.

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## When to Use

Use this skill when:

- BASIC_DESIGN.md exists and boundaries are agreed.
- Need implementable contracts, models, sequences, or rules before planning or coding.
- Need DETAIL_DESIGN.md for handoff to planning.
- Need BR/AC → design section traceability.

## When NOT to Use

Do NOT use this skill when:

- BASIC_DESIGN.md is missing or still blocked — use basic-design (or research/investigate).
- Direction is unclear — use brainstorming.
- Business requirements are unresolved — use business-analysis.
- Task is small/clear (Lite skip from brainstorming) — planning or execution is enough.
- User wants task IDs, DoD, verification commands, or rollback — use planning.
- User wants code changes — use execution.

## Quality Standards

- [ ] Goal links to basic-design decisions; no new architecture invented.
- [ ] Only in-scope surfaces get contracts and operations.
- [ ] Data fields and relations mark confidence (known / inferred).
- [ ] Sequences cover main path; error paths when failures matter.
- [ ] Unused optional sections are omitted.
- [ ] Gaps are listed when sources lack detail — not invented away.
- [ ] Handoff is to planning (blocking items called out).

## WRONG vs CORRECT

```markdown
// WRONG — inventing schema as fact
Item.code is VARCHAR(20) NOT NULL unique globally.

// CORRECT — confidence labeled
Item.code (inferred): string, unique within tenant — confirm with data owner.
Item.tenantId (known): FK from existing schema.
```

```markdown
// WRONG — forcing UI matrix on a pure API job
Controls / Screens / Tabs: all N/A...

 // CORRECT — omit client mapping; detail the API surface
Contracts: POST /items — 422 on missing required fields.
Operations: base Item; filter tenantId = :id; sort createdAt desc.
```

```markdown
// WRONG — planning dumped into detail design
T-001: Implement. DoD: PR merged.

// CORRECT — design only
Sequence: Client → API → Service → Store; on scope miss return SCOPE_DENIED.
Handoff: planning.
```

## Edge Cases

| Situation | Handling |
|---|---|
| Basic design still blocked | Do not guess. Flag and recommend research/investigate or stakeholder decision. |
| No UI/client in scope | Omit client_mapping. |
| No persistence | Omit data_model / persistence_spec or keep ephemeral structures only. |
| Existing contracts reused | Prefer inspect-repo facts; mark new contracts as proposed. |
| Source incomplete | Record gaps; partial design is OK if handoff states blockers. |
| BA missing | Trace to DISCUSSION; do not invent BR IDs. |

## Limitations

- Does NOT implement code.
- Does NOT expand scope beyond BASIC_DESIGN.md.
- Does NOT replace planning (no task IDs, DoD, rollback).
- Does NOT treat inferred details as confirmed facts.
- Does NOT re-open architecture without an open question.
- Does NOT hardcode a product domain, UI toolkit, or stack.
