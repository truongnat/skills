---
name: graphql-pro
description: |
  Professional GraphQL guidance for schema design, resolver architecture, performance optimization, and secure API evolution.

  Use this skill when designing GraphQL schemas, implementing resolvers, reviewing query/mutation patterns, or stabilizing GraphQL behavior in production.

  Triggers: "graphql", "schema", "resolver", "query", "mutation", "subscription", "n+1", "dataloader", "federation", "persisted query", "graphql edge case", "Apollo", "Mercurius", "complexity limit", "introspection", "GraphQL Playground".

  Combine with `api-design-pro` for contract governance and `security-pro` for GraphQL-specific hardening.
metadata:
  short-description: GraphQL — schema, resolvers, performance, security, edge cases
---

# GraphQL (professional)

Use official [GraphQL Specification](https://spec.graphql.org/), [GraphQL over HTTP](https://graphql.github.io/graphql-over-http/), and [GraphQL.org best practices](https://graphql.org/learn/) for standards truth; this skill encodes **schema-first modeling**, **resolver discipline**, and **production-safe performance/security defaults**. Confirm **GraphQL server stack** (Apollo/Mercurius/Helix/etc.), **client patterns**, and **compatibility constraints** from the project.

## Related skills (this repo)

| Skill | When to combine |
|-------|------------------|
| `api-design-pro` | Align GraphQL contract evolution, error semantics, and deprecation policy. |
| `security-pro` | Review auth, introspection exposure, query abuse, and data leakage risks. |

## When to use

- Designing new GraphQL schema types, fields, and mutation contracts.
- Reviewing resolver implementation quality, N+1 risks, and batching strategies.
- Improving GraphQL latency/cost and limiting abusive query patterns.
- Planning backward-compatible schema evolution and deprecation.
- Trigger keywords: `graphql`, `schema`, `resolver`, `query`, `mutation`, `subscription`, `n+1`, `dataloader`, `federation`, `persisted query`, `graphql edge case`

## Workflow

1. **Confirm** versions / environment / stack (GraphQL server, transport mode, auth model, federation/single graph, client usage patterns).
2. **Apply the principles and topic summaries below; open `references/` when you need depth.**
3. **Respond using **Suggested response format**;** note the main risks (N+1 regressions, schema breakage, query abuse, authorization gaps).

### Operating principles

1. **Design schema around domain, not tables** - expose stable client-facing concepts.
2. **Resolver behavior is explicit** - auth, validation, and error semantics are consistent per field.
3. **Performance is part of contract** - batch, cache, and bound query complexity from the start.
4. **Evolution is additive-first** - deprecate before remove and keep migration paths clear.
5. **Security at field level** - enforce least privilege and protect introspection/query surface as needed.

### GraphQL tips and tricks (summary)

- Use DataLoader-style batching for relation-heavy reads to avoid N+1 query storms.
- Prefer narrow, composable types; avoid "god types" with mixed concerns.
- Add query depth/complexity limits and cost awareness for expensive fields.
- Standardize error extensions and request tracing for observability.

Details: [references/tips-and-tricks.md](references/tips-and-tricks.md)

### GraphQL edge cases (summary)

- Nullable vs non-null changes can accidentally break client assumptions.
- Federation/subgraph ownership drift causes duplicated or inconsistent field semantics.
- Over-fetching via nested queries can bypass expected backend resource budgets.
- Subscription fan-out can overload infra without backpressure and filtering controls.

Details: [references/edge-cases.md](references/edge-cases.md)

### Decision tree (summary)

- Schema shape, mutation idempotency, federation vs monolith, security limits — see reference.

Details: [references/decision-tree.md](references/decision-tree.md)

### Anti-patterns (summary)

- N+1 resolvers, nullable churn, leaky `extensions`, unbounded lists.

Details: [references/anti-patterns.md](references/anti-patterns.md)

### Integration map (summary)

- **`api-design-pro`**, **`security-pro`**, **`nestjs-pro`**, **`postgresql-pro`**, **`testing-pro`**.

Details: [references/integration-map.md](references/integration-map.md)

### Stack versions (summary)

- Server major, federation compatibility, client codegen pins.

Details: [references/versions.md](references/versions.md)

### Suggested response format (implement / review)

1. **Issue or goal** - define schema/resolver problem or target.
2. **Recommendation** - propose contract-safe, performance-aware GraphQL decisions.
3. **Code** - provide SDL/resolver snippets, query patterns, or migration checklist.
4. **Residual risks** - list compatibility, security, and operational risks.

## Resources in this skill

Use these files for deeper detail when concise guidance in this file is not enough.

| Topic | File |
|-------|------|
| Practical GraphQL design/resolver patterns | [references/tips-and-tricks.md](references/tips-and-tricks.md) |
| GraphQL failure modes and edge cases | [references/edge-cases.md](references/edge-cases.md) |
| Decision tree | [references/decision-tree.md](references/decision-tree.md) |
| Anti-patterns | [references/anti-patterns.md](references/anti-patterns.md) |
| Integration map | [references/integration-map.md](references/integration-map.md) |
| Versions | [references/versions.md](references/versions.md) |

## Quick example

**Input:** "Review GraphQL resolver layer for N+1 and auth gaps before release."  
**Expected output:** Prioritized resolver/schema fixes with concrete SDL/resolver actions and residual risk notes.

**Input:** "Introspection enabled in production — security audit flagged it."  
**Expected output:** Threat model (schema enumeration, field discovery); gate by env or auth; pair with **`security-pro`**; document operational need if kept.

**Input:** "Federation: two subgraphs both expose `User.name` with different nullability."  
**Expected output:** Composition error root cause; ownership rule; migration with `@override` / deprecation; compatibility checklist.

## Checklist before calling the skill done

- [ ] Schema and resolver responsibilities are clearly separated.
- [ ] N+1 and query-cost controls are explicitly addressed.
- [ ] At least one compatibility edge case and one security edge case are covered.
- [ ] Code section includes concrete SDL/resolver/checklist guidance.
- [ ] Residual risks include migration and runtime monitoring concerns.
- [ ] Nullable/non-null changes and client impact are assessed.
- [ ] AuthZ checked at field level, not only HTTP layer.
- [ ] Subscription fan-out / scaling risks noted if subscriptions exist.
