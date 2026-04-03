---
name: api-design-pro
description: |
  Professional API design guidance for building clear, evolvable, and secure service contracts across REST-style and RPC-style interfaces.

  Use this skill when designing new APIs, reviewing API changes, improving contract consistency, or planning backward-compatible evolution.

  Triggers: "api design", "rest api", "endpoint", "contract", "versioning", "pagination", "error model", "idempotency", "backward compatibility", "schema evolution", "openapi", "swagger", "429", "400 vs 500", "webhook", "HATEOAS", "rate limit".

  Combine with `security-pro` for threat-focused hardening and `testing-pro` for contract and integration verification.
metadata:
  short-description: API design — contracts, versioning, consistency, evolution, edge cases
---

# API design (professional)

Use official [HTTP Semantics RFC 9110](https://www.rfc-editor.org/rfc/rfc9110), [OpenAPI Specification](https://spec.openapis.org/oas/latest.html), and [JSON Schema](https://json-schema.org/specification) for standards truth; this skill encodes **contract-first design**, **evolution safety**, and **operationally practical API conventions**. Confirm **API style** (REST/RPC/event), **client ecosystem**, and **compatibility constraints** from the project.

## Related skills (this repo)

| Skill | When to combine |
|-------|------------------|
| `security-pro` | Validate auth, data exposure, abuse paths, and sensitive endpoint hardening. |
| `testing-pro` | Add contract, integration, and regression tests for API behavior over time. |

## When to use

- Designing new public/internal APIs with clear request/response contracts.
- Reviewing breaking-change risk in endpoint/schema updates.
- Standardizing pagination, filtering, sorting, error handling, and idempotency behavior.
- Planning API versioning and deprecation strategy without disrupting clients.
- Trigger keywords: `api design`, `rest api`, `endpoint`, `contract`, `versioning`, `pagination`, `error model`, `idempotency`, `backward compatibility`, `schema evolution`

## Workflow

1. **Confirm** versions / environment / stack (API style, transport, auth model, client expectations, compatibility window).
2. **Apply the principles and topic summaries below; open `references/` when you need depth.**
3. **Respond using **Suggested response format**;** note the main risks (breaking changes, ambiguous contracts, insecure defaults, inconsistent errors).

### Operating principles

1. **Contract clarity first** - every field and status code should have explicit meaning and stable behavior.
2. **Backward compatibility by default** - additive evolution preferred; breaking change must be intentional and managed.
3. **Consistency over endpoint-by-endpoint style** - shared patterns for naming, errors, pagination, and filtering.
4. **Idempotency where retry is expected** - design safe retry semantics for network and client failures.
5. **Observability-ready APIs** - include traceability and actionable error information without leaking sensitive internals.

### API design tips and tricks (summary)

- Model resources and actions using clear nouns/verbs, but prioritize client task flow over pure naming theory.
- Standardize error envelope shape (`code`, `message`, `details`, `requestId`) across all endpoints.
- Use cursor-based pagination for large mutable datasets; document sorting and stability guarantees.
- Prefer explicit field semantics (`null` vs missing vs empty) to avoid client misinterpretation.

Details: [references/tips-and-tricks.md](references/tips-and-tricks.md)

### API edge cases (summary)

- Retries can duplicate side effects unless idempotency keys or safe semantics are enforced.
- Time zone/date handling causes subtle bugs when format and timezone guarantees are unclear.
- Partial updates can unintentionally clear fields without clear patch semantics.
- Version drift between clients and backend can surface silent contract mismatch bugs.

Details: [references/edge-cases.md](references/edge-cases.md)

### Decision tree (summary)

- REST vs RPC vs events; pagination model; versioning and error envelope — see reference.

Details: [references/decision-tree.md](references/decision-tree.md)

### Anti-patterns (summary)

- Wrong status codes, ambiguous null semantics, missing idempotency on mutating POST.

Details: [references/anti-patterns.md](references/anti-patterns.md)

### Integration map (summary)

- Pair with **`security-pro`**, **`testing-pro`**, **`graphql-pro`**, stack skills for implementation.

Details: [references/integration-map.md](references/integration-map.md)

### Versioning (summary)

- URL vs header versioning; deprecation headers; OpenAPI per major version.

Details: [references/versions.md](references/versions.md)

### Suggested response format (implement / review)

1. **Issue or goal** - define API problem or target behavior.
2. **Recommendation** - propose contract and evolution-safe decisions with rationale.
3. **Code** - provide OpenAPI/JSON examples, endpoint spec, or migration checklist.
4. **Residual risks** - list compatibility, security, and rollout risks.

## Resources in this skill

Use these files for deeper detail when concise guidance in this file is not enough.

| Topic | File |
|-------|------|
| Practical API design patterns | [references/tips-and-tricks.md](references/tips-and-tricks.md) |
| API evolution and runtime edge cases | [references/edge-cases.md](references/edge-cases.md) |
| Decision tree | [references/decision-tree.md](references/decision-tree.md) |
| Anti-patterns | [references/anti-patterns.md](references/anti-patterns.md) |
| Integration map | [references/integration-map.md](references/integration-map.md) |
| Versioning | [references/versions.md](references/versions.md) |

## Quick example

**Input:** "Design v2 order API with backward compatibility and consistent error model."  
**Expected output:** Contract-first endpoint proposal with versioning/deprecation path, concrete payload/error examples, and migration risks.

**Input:** "Clients retry POST /payments on timeout — we see duplicate charges."  
**Expected output:** Idempotency-Key pattern or natural keys; document 409 vs 200 semantics; webhook reconciliation note; pair with **`security-pro`** for abuse.

**Input:** "GraphQL and REST both expose orders — errors and versioning diverge."  
**Expected output:** Align error shape and deprecation policy; defer GraphQL specifics to **`graphql-pro`**; single source of truth for domain IDs.

## Checklist before calling the skill done

- [ ] Contract semantics (fields, status codes, error model) are explicit.
- [ ] Backward compatibility impact is assessed and documented.
- [ ] At least one idempotency/retry and one schema-evolution edge case is addressed.
- [ ] Code section includes concrete spec snippets or migration checklist.
- [ ] Residual risks include rollout/monitoring and client migration concerns.
- [ ] Pagination and filtering semantics are stated if list endpoints exist.
- [ ] Rate limiting / abuse response (429) strategy mentioned for public APIs.
- [ ] PII and sensitive fields called out for logging and error payloads.
