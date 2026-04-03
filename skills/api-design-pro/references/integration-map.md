# API design — integration map

| Skill | Combine when |
|-------|----------------|
| **`security-pro`** | AuthZ on every sensitive route; rate limits; PII in logs/responses. |
| **`testing-pro`** | Contract tests, consumer-driven contracts, chaos on timeouts. |
| **`graphql-pro`** | If API is GraphQL — schema evolution, resolver errors vs HTTP. |
| **`nestjs-pro` / `nextjs-pro`** | Framework routing, guards, server actions — map to HTTP semantics. |
| **`deployment-pro`** | Blue/green, canary — how clients handle mixed versions. |

**Boundary:** `api-design-pro` owns contract shape and evolution; implementations live in stack skills.
