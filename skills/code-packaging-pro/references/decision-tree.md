# Code packaging — decision tree

## Artifact

- **Library** → Semver, multi-Python test matrix, wheel to PyPI.
- **Service image** → Multi-stage Docker, non-root, `.dockerignore`.

## Publish

- **Trusted publishing** → OIDC to PyPI/GHCR vs long-lived tokens.

## Scope

- **Runtime topology** (K8s vs Lambda) → **`deployment-pro`**, not Dockerfile-only.
