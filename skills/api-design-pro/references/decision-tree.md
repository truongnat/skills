# API design — decision tree

## REST vs RPC vs events

- **Resource-oriented CRUD, cacheable reads** → REST-style + HTTP verbs + standard status codes.
- **Procedure-heavy, tight coupling to server actions** → RPC (gRPC, JSON-RPC) or GraphQL mutations — pair with **`graphql-pro`** if GraphQL.
- **Fan-out notifications, audit streams** → Events/webhooks; document idempotency and signing.

## Pagination

- **Stable large lists, frequent updates** → Cursor-based; document sort key stability.
- **Simple admin UIs, small datasets** → Offset/limit acceptable; warn on deep pages.

## Versioning

- **Public many clients** → URL path or header version; deprecation timeline + telemetry.
- **Internal only** → Coordinated deploys; still document breaking fields.

## Error model

- **Machine clients** → Stable `code` + optional `details`; include `requestId`.
- **Human-only** → Still avoid leaking stack traces; log server-side.
