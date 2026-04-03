# Deployment — decision tree

## Runtime

- **Static** → CDN + atomic invalidation.
- **Stateful API** → Rolling/canary + health + migrations.

## Blast radius

- **Low observability** → Smaller steps, feature flags, not big-bang.

## DB change

- **Breaking schema** → Expand/contract; **`postgresql-pro`** before cutover.
