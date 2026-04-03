# Repo tooling — decision tree

## Queries

- **Many questions, one session** → `query-kb-batch` (one model load).
- **One-off** → `query-kb`.

## After doc edits

- **`knowledge-base/documents/`** changed → `build-kb` then `verify-kb`.

## Skill changes

- New/changed `skills/**` → `validate-skills` + `build-skill-index`.

## Audit vs daily dev

- **Bundle quality** → `analyze-skills` + **`skills-self-review-pro`**.
