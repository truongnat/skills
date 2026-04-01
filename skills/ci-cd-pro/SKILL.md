---
name: ci-cd-pro
description: |
  Professional CI/CD pipeline design: GitHub Actions, GitLab CI, pipeline architecture, test automation, deployment strategies, secrets management, and pipeline reliability.

  Use this skill when the user works on GitHub Actions, GitLab CI/CD, CircleCI, Jenkins, pipeline YAML, workflows, jobs, steps, runners, secrets, environment variables, cache, artifacts, matrix builds, deployment gates, release automation, branch protection, or continuous delivery.

  Triggers: "GitHub Actions", "GitLab CI", "CircleCI", "Jenkins", "pipeline", "workflow", "YAML", ".github/workflows", "runner", "job", "step", "artifact", "cache", "matrix", "deploy", "release", "secrets", "environment", "branch protection", "merge queue", "CD", "CI", "continuous integration", "continuous delivery", "canary deploy", "blue-green", "rollback".

metadata:
  short-description: CI/CD — GitHub Actions, pipelines, deployment strategies, reliability
---

# CI/CD (professional)

Use official [GitHub Actions docs](https://docs.github.com/en/actions) and [GitLab CI/CD docs](https://docs.gitlab.com/ee/ci/) for syntax reference; this skill encodes **pipeline architecture discipline**, **secrets hygiene**, and **deployment strategy patterns**. Confirm the **CI platform** (GitHub Actions / GitLab / CircleCI), **deployment target**, and **existing branching strategy** when known.

## Related skills (this repo)

| Skill | When to combine |
|-------|----------------|
| `docker-pro` | Container builds and registry pushes in pipelines |
| `deployment-pro` | Release strategies, rollbacks, environment promotion |
| `testing-pro` | Test stage structure, parallelism, flakiness handling |
| `security-pro` | Secrets management, OIDC, supply chain security |
| `git-operations-pro` | Branch strategy that drives pipeline triggers |

## When to use

- Designing or reviewing GitHub Actions workflows or GitLab CI YAML.
- Optimizing pipeline speed with caching, parallelism, and job splitting.
- Securing secrets with OIDC, environment protection rules, and least-privilege tokens.
- Implementing deployment strategies: blue-green, canary, feature flags.
- Setting up matrix builds, reusable workflows, and composite actions.
- Trigger keywords: `GitHub Actions`, `pipeline`, `.github/workflows`, `matrix`, `OIDC`, `deploy`, `canary`, …

## Workflow

1. Confirm CI platform, deployment target, and branching strategy (trunk-based, Gitflow, etc.).
2. Apply the principles and topic summaries below; open `references/` when you need depth.
3. Respond using **Suggested response format**; call out secrets exposure, flakiness, and rollback risks.

### Operating principles

1. **Fail fast** — lint and type-check before tests; unit tests before integration; shift left.
2. **Cache aggressively** — cache dependencies keyed on lockfile hash; cache Docker layers with registry.
3. **Least-privilege secrets** — use OIDC over long-lived credentials; scope environment secrets to target environments.
4. **Idempotent deployments** — re-running a deploy should be safe; use version tags not `latest`.
5. **Pipeline as code, reviewed as code** — workflow files go through PR review; protect default branch.
6. **Observability in pipelines** — surface test reports, coverage, and deploy duration as pipeline artifacts.

### GitHub Actions structure (summary)

- `on:` triggers: `push`, `pull_request`, `workflow_dispatch`, `schedule`, `release`.
- `jobs:` run in parallel by default; use `needs:` for dependencies.
- `steps:` are sequential within a job; each `run:` starts a new shell.
- `env:` at workflow/job/step scope; job-level overrides workflow-level.
- `outputs:` pass data between jobs via `steps.<id>.outputs.<key>`.

Details: [references/github-actions.md](references/github-actions.md)

### Secrets and security (summary)

- **OIDC** — authenticate to AWS/GCP/Azure without long-lived keys: `permissions: id-token: write`.
- **Environment secrets** — scope secrets to `production`/`staging` environments with protection rules.
- **`GITHUB_TOKEN`** — use for repo-scoped operations; scope permissions with `permissions:` block.
- **Secret scanning** — enable in repo settings; never echo secrets; use `::add-mask::` for dynamic values.
- **Pinned actions** — pin third-party actions to full SHA (`uses: actions/checkout@a81bbbf...`) to prevent supply chain attacks.

Details: [references/secrets-security.md](references/secrets-security.md)

### Pipeline optimization (summary)

- **Dependency caching**: `actions/cache` keyed on `hashFiles('**/package-lock.json')`.
- **Matrix builds**: test across Node versions, OS, or browser in parallel.
- **Reusable workflows**: `workflow_call` for DRY pipelines across repos.
- **Job concurrency**: `concurrency: group: ${{ github.ref }}` to cancel stale runs on the same branch.
- **Self-hosted runners**: for larger workloads or private network access; use ephemeral runners.

Details: [references/optimization.md](references/optimization.md)

### Deployment strategies (summary)

- **Blue-green** — two identical environments; switch traffic at load balancer; instant rollback.
- **Canary** — route small % of traffic to new version; monitor; expand or rollback.
- **Rolling** — replace instances one-by-one; no double-capacity cost; slower rollback.
- **Feature flags** — decouple deploy from release; gate new code paths in production.
- **Environment promotion gates** — manual approval step before production via `environment: production` with required reviewers.

Details: [references/deployment-strategies.md](references/deployment-strategies.md)

### Suggested response format (implement / review)

1. **Issue or goal** — Pipeline problem, new workflow design, or deployment strategy question.
2. **Recommendation** — Pipeline structure, caching strategy, or secrets approach.
3. **Code** — YAML workflow snippet with inline comments.
4. **Residual risks** — Secret exposure, flaky tests, rollback gaps, or cost concerns.

## Resources in this skill

- `references/` — topic deep-dives; do not paste entire reference docs into SKILL.md.

| Topic | File |
|-------|------|
| **GitHub Actions structure** | [references/github-actions.md](references/github-actions.md) |
| Secrets and security | [references/secrets-security.md](references/secrets-security.md) |
| Pipeline optimization | [references/optimization.md](references/optimization.md) |
| Deployment strategies | [references/deployment-strategies.md](references/deployment-strategies.md) |

## Quick example

**Input:** GitHub Actions workflow that runs tests takes 12 minutes; `npm install` runs every time.
**Expected output:** Add `actions/cache` keyed on `package-lock.json` hash, split into lint/test/build jobs running in parallel, estimate to ~3 min; show full updated YAML.

## Checklist before calling the skill done

- [ ] Secrets use OIDC or environment-scoped secrets; no long-lived credentials in workflow env.
- [ ] Third-party actions pinned to full SHA.
- [ ] Dependency cache present, keyed on lockfile hash.
- [ ] Jobs fail fast: lint before test, unit before integration.
- [ ] Production deploy has manual approval gate or canary step.
- [ ] Concurrency cancellation configured to avoid stale runs.
- [ ] Test artifacts (reports, coverage) uploaded for visibility.
