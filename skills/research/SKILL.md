---
name: research
description: Research internal or external sources before making technical/product decisions. Source-backed findings, comparison matrix, recommendations with citations and caveats.
---

# Research

## Purpose

Collect, verify, and synthesize evidence to support technical, product, or operational decisions.

## XML Contract

```xml
<Contract>
  <Inputs>Research question, decision context, local evidence, external source constraints, freshness requirement, quality bar.</Inputs>
  <Outputs>RESEARCH.md with source strategy, evidence, findings, comparison matrix, recommendation, confidence, caveats, residual risks.</Outputs>
  <Artifacts>
    <File name="RESEARCH.md" required="true">
      <Schema>
        <field name="question" type="string" required="true">Research question.</field>
        <field name="decision_context" type="string" required="true">What decision this research supports.</field>
        <field name="status" type="string" required="true">Complete / Complete with caveats / Partial / Blocked.</field>
        <field name="source_strategy" type="array" required="true">Source type, purpose, notes.</field>
        <field name="sources_reviewed" type="array" required="true">Source ID, name, type, date/version, relevance.</field>
        <field name="findings" type="array" required="true">Finding, evidence, confidence.</field>
        <field name="comparison_matrix" type="table" required="false">Option columns x criteria rows.</field>
        <field name="recommendation" type="string" required="true">Recommended option, confidence, reason, why not alternatives.</field>
        <field name="caveats" type="array" required="false">Caveat with impact and mitigation.</field>
        <field name="residual_risks" type="array" required="false">Risk, impact, suggested follow-up.</field>
        <field name="handoff" type="string" required="true">Ready for planning/execution? Required verification?</field>
      </Schema>
    </File>
  </Artifacts>
  <Safety>Do NOT fabricate citations. Do NOT copy long source content. Do NOT use stale sources for decisions needing fresh information. Do NOT present inference as fact. Do NOT omit caveats or residual risks.</Safety>
</Contract>
```

## Quality Standards

- [ ] Source quality is noted (Primary/Secondary/Community/Marketing/Unknown).
- [ ] Freshness is checked for time-sensitive information (API versions, pricing, features).
- [ ] Facts, inferences, and opinions are separated.
- [ ] Comparison matrix exists when multiple options are evaluated.
- [ ] Recommendation includes confidence level (High/Medium/Low).
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
