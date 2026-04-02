# CI/CD — decision trees

## GitHub Actions: reusable workflow vs composite action vs matrix

```
Same pipeline repeated across many repos?
├── Reusable workflow (`workflow_call`)
├── Repeated steps inside one repo (setup Node, cache)?
│   └── Composite action
└── Test across Node/OS/browser versions?
    └── `strategy.matrix` — keep jobs parallel where possible
```

## OIDC to cloud vs long-lived secrets

```
Deploying to AWS/GCP/Azure from GitHub?
├── Prefer OIDC (`id-token: write`) — no static cloud keys in repo secrets
└── Legacy systems requiring static keys?
    └── Short-lived tokens where possible; rotate; scope IAM narrowly
```

## Canary vs blue-green vs rolling

```
Need instant rollback with double capacity acceptable?
├── Blue-green
├── Gradual risk reduction with metrics gates?
│   └── Canary + automated promotion/rollback
└── Cost-sensitive, slower rollback OK?
    └── Rolling
```

## When to block the merge queue

```
Change touches auth, migrations, infra, or license compliance?
├── Required checks + optional manual approval for production
└── Docs-only?
    └── Fast path — still run spelling/link checks if configured
```

## Further reading

- [github-actions.md](github-actions.md), [secrets-security.md](secrets-security.md), [deployment-strategies.md](deployment-strategies.md)
