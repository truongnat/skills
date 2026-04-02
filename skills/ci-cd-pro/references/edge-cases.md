# CI/CD — edge cases

- **Merge queue / batch merges:** Order of commits differs from local; ensure migrations and feature flags tolerate interleaved deploys.

- **Clock skew:** JWT between systems or signed URLs may fail near boundaries; use NTP on runners.

- **Rate limits:** npm, Docker Hub, GitHub API — add retries with backoff and authenticated pulls where possible.

- **Flaky tests:** retry only as a temporary measure; quarantine and fix root cause; mark known flakes.

- **Conditional secrets:** `if:` on steps referencing secrets — empty secrets can still be “defined”; validate behavior.

- **Windows vs Linux paths:** matrix builds need path separators and shell differences (`bash` vs `pwsh`).

- **Large logs:** truncate verbose test output; some CI systems truncate or fail huge logs.

- **Submodule / subtree clones:** shallow clone depth can miss tags needed for versioning.

- **Scheduled workflows on inactive repos:** GitHub disables scheduled workflows after repo inactivity — document re-enable.

- **OIDC audience / subject:** misconfigured trust relationship causes cryptic auth failures — align IdP claims with cloud IAM.

Pair with **`testing-pro`** for flake strategy and **`security-pro`** for secret exposure review.
