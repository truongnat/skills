---
name: research
description: "Research internal or external sources before making technical/product decisions. Source-backed findings, comparison matrix, recommendations with citations and caveats. (Hard contract in this SKILL.md — MUST follow.)"
---

# Research

## Language (do this first)

**Re-read `.agents/settings.yaml` now** — do not reuse a `language` value cached
earlier in this session. Write every saved artifact and reply in that `language`
(`en` or `vi`); keep code, identifiers, paths, commands, and template section
keys unchanged. If the user just edited settings, the freshly read value wins. A
direct instruction in the current user request overrides the file.

## Purpose

Collect, verify, and synthesize evidence to support technical, product, or operational decisions.

## Contract (mandatory)

This skill is a **hard contract**. Obey it before any other action. Do NOT treat as optional. Do NOT skip required artifacts.

| Field | Requirement |
|-------|-------------|
| Inputs | Research question, decision context, local evidence, external source constraints, freshness requirement, quality bar. |
| Outputs | RESEARCH.md with source strategy, evidence, findings, comparison matrix, recommendation, confidence, caveats, residual risks. |
| Safety | Do NOT fabricate citations. Do NOT copy long source content. Do NOT use stale sources for decisions needing fresh information. Do NOT present inference as fact. Do NOT omit caveats, residual risks, or Spec quality challenges (feasibility/correctness/capability gaps). |

### Required artifacts

#### `RESEARCH.md`
- Required: yes
- **executive_summary** (required, array): Maximum five bullets with answer, strongest evidence, caveat/risk, recommendation, and next action.
- **developer_overview** (required, object): Research status, answer confidence, top caveat, next action.
- **charts** (optional, array): Mermaid comparison chart when useful; otherwise N/A.
- **question** (required, string): Research question.
- **decision_context** (required, string): What decision this research supports.
- **status** (required, string): Complete / Complete with caveats / Partial / Blocked.
- **source_strategy** (required, array): Source type, purpose, notes.
- **sources_reviewed** (required, array): Source ID, name, type, date/version, relevance.
- **findings** (required, array): Finding, evidence, confidence.
- **comparison_matrix** (optional, table): Option columns x criteria rows.
- **recommendation** (required, string): Recommended option, confidence, reason, why not alternatives.
- **spec_quality_review** (required when research supports a feature/spec decision, object): Feasibility, Correctness, Capability recommendations inferred from evidence.
- **caveats** (optional, array): Caveat with impact and mitigation.
- **residual_risks** (optional, array): Risk, impact, suggested follow-up.
- **handoff** (required, string): Ready for planning/execution? Required verification?

### Reference

`agents/openai.yaml` is a machine-readable duplicate for tooling. The Contract in this SKILL.md is authoritative for agents.

## Quality Standards

- [ ] Source quality is noted (Primary/Secondary/Community/Marketing/Unknown).
- [ ] Freshness is checked for time-sensitive information (API versions, pricing, features).
- [ ] Facts, inferences, and opinions are separated.
- [ ] Comparison matrix exists when multiple options are evaluated.
- [ ] Recommendation includes confidence level (High/Medium/Low).
- [ ] When researching a feature/spec, Spec quality review covers Feasibility, Correctness, and Capability gaps suggested by evidence.
- [ ] Caveats and residual risks are documented.

## WRONG vs CORRECT

```markdown
// WRONG — no source, no freshness check
React 19 supports server components.

// CORRECT — sourced and versioned
Fact (source: react.dev blog, 2026-03): React 19.1 stable supports server components.
Freshness: checked 2026-07-13.
Caveat: The recommendation only applies if the repo uses React 19+.
```

```markdown
// WRONG — no comparison, just listing
Option A and B are both good.

// CORRECT — comparison matrix with criteria
| Criteria | Option A (Library X) | Option B (Library Y) |
|---|---|---|
| License | MIT | AGPL (⚠️ restriction) |
| Bundle size | 12KB | 45KB |
| Last release | 2026-06 | 2025-03 (⚠️ stale) |
| Native ESM | Yes | No |
Recommendation: Option A. Lower risk, better license, lighter bundle.
```

## Edge Cases

| Situation | Handling |
|---|---|
| Official docs contradict community sources | Prefer official docs. Document the conflict and why the official source was chosen. |
| Pricing page does not list pricing | Document as caveat. Do NOT guess pricing. |
| Source is too old (>1 year for fast-moving tools) | Lower confidence, recommend verification before implementation. |
| No external sources available (offline) | Mark as "offline research only". Document limitations. |
| Research question is too broad | Narrow to 2-3 sub-questions. Recommend planning the research scope. |

## Limitations

- Does NOT implement.
- Does NOT replace planning or investigate.
- Does NOT guarantee external sources are always correct.
