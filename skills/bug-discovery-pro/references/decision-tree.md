# Bug discovery — decision tree

## Tooling

- **Graph indexed** → `query` → `context` → `impact` / `api_impact`.
- **No graph** → Grep + tests + bisect; honest limits.

## Symptom

- **Intermittent** → Repro harness first; logging correlation.
- **Shape/API** → `shape_check` + consumer search if available.

## Security-sensitive

- **Abuse class** → **`security-pro`**; graph is not pen-test.
