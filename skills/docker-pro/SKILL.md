---
name: docker-pro
description: |
  Professional Docker and container development: Dockerfile authoring, multi-stage builds, image optimization, Docker Compose, networking, volumes, secrets, and production hardening.

  Use this skill when the user works on Docker, Dockerfile, docker-compose, container images, multi-stage builds, .dockerignore, image layers, container networking, volumes, bind mounts, secrets, health checks, Docker Hub, container registries, BuildKit, or containerizing Node/Python/Go/Java applications.

  Triggers: "Docker", "Dockerfile", "docker-compose", "container", "image", "multi-stage build", "layer", "BuildKit", "COPY", "RUN", "CMD", "ENTRYPOINT", "ARG", "ENV", "volume", "bind mount", "health check", "registry", "docker push", "docker pull", "distroless", ".dockerignore", "compose", "docker network", "bridge network", "overlay".

metadata:
  short-description: Docker — Dockerfile, multi-stage builds, Compose, production hardening
---

# Docker (professional)

Use official [Docker docs](https://docs.docker.com/) for command reference; this skill encodes **image optimization discipline**, **production security defaults**, and **Compose workflow patterns**. Confirm the **Docker Engine version**, **target runtime** (Node/Python/Go/etc.), and **deployment target** (local, Kubernetes, cloud run) when known.

## Related skills (this repo)

| Skill | When to combine |
|-------|----------------|
| `ci-cd-pro` | Docker builds in GitHub Actions, image push pipelines |
| `deployment-pro` | Registry strategies, rolling deploys, Kubernetes manifests |
| `security-pro` | Non-root users, secret management, vulnerability scanning |
| `network-infra-pro` | Container networking, DNS, overlay networks |

## When to use

- Writing or reviewing Dockerfiles for any runtime (Node, Python, Go, Java, etc.).
- Optimizing image size with multi-stage builds, layer caching, and `.dockerignore`.
- Composing multi-service environments with Docker Compose.
- Hardening containers for production: non-root user, read-only filesystem, health checks.
- Debugging container networking, volume mounts, and environment variable injection.
- Trigger keywords: `Docker`, `Dockerfile`, `multi-stage`, `docker-compose`, `container`, `image size`, `distroless`, …

## Workflow

1. Confirm Docker Engine version, target runtime, and deployment target (local/K8s/Cloud Run/etc.).
2. Apply the principles and topic summaries below; open `references/` when you need depth.
3. Respond using **Suggested response format**; call out image size, security, and caching risks.

### Operating principles

1. **Layer cache is money** — order instructions from least-to-most-frequently-changed; `COPY package*.json` before `COPY src/`.
2. **Multi-stage always** — separate build and runtime stages; never ship build toolchains to production.
3. **Non-root by default** — add `USER nonroot` or create a user; never run production containers as root.
4. **Minimal base** — prefer `alpine`, `slim`, or `distroless` over full OS images; each installed package is attack surface.
5. **`.dockerignore` is mandatory** — exclude `node_modules`, `.git`, test files, secrets; prevents cache busting and leaking.
6. **Immutable containers** — pass config via environment variables, not baked-in files; use secrets for credentials.

### Dockerfile authoring (summary)

- `FROM ... AS builder` → multi-stage: build in full image, copy artifacts to minimal runtime image.
- `COPY --chown=user:group` — set ownership at copy time rather than a separate `RUN chown`.
- `RUN --mount=type=cache` — BuildKit cache mounts for package managers (npm, pip, go mod).
- `HEALTHCHECK` — always define for long-running services; enables orchestrator restart logic.
- `ARG` vs `ENV` — `ARG` is build-time only (safe for versions); `ENV` is runtime (avoid secrets).

Details: [references/dockerfile.md](references/dockerfile.md)

### Image optimization (summary)

- **Layer squashing** — chain `RUN` commands with `&&` to reduce layer count for apt/apk installs.
- **Build cache** — split `COPY package*.json ./` + `RUN npm ci` from `COPY . .` to maximize cache hits.
- **Distroless / scratch** — for Go/static binaries use `FROM scratch`; for dynamic runtimes use `gcr.io/distroless`.
- **`--no-install-recommends`** — always use with `apt-get install` to skip optional packages.

Details: [references/image-optimization.md](references/image-optimization.md)

### Docker Compose (summary)

- Use `depends_on` with `condition: service_healthy` to sequence start order safely.
- Named volumes for persistent data; bind mounts only for local development.
- `env_file` for local secrets; never commit `.env` files with real credentials.
- `profiles` to enable optional services (e.g., a dev-only admin UI).
- Override files: `docker-compose.override.yml` for local dev; `-f compose.prod.yml` for production.

Details: [references/compose.md](references/compose.md)

### Tips and tricks (summary)

- `docker build --progress=plain` for verbose layer output during debugging.
- `docker image history <image>` to inspect layer sizes.
- `dive` tool for interactive layer analysis.
- `docker system prune -af` to reclaim disk; warn in CI before caching layers.
- `DOCKER_BUILDKIT=1` (or `buildx`) for advanced caching, multi-platform, and secret mounts.

Details: [references/tips-and-tricks.md](references/tips-and-tricks.md)

### Edge cases (summary)

- **PID 1 signal handling** — use `tini` or `dumb-init` as init process; `node` does not forward SIGTERM by default.
- **File permission in volumes** — bind-mounted files on Linux use host UIDs; may mismatch container user.
- **ARM vs AMD64** — use `--platform` flag or `docker buildx` for multi-arch images.
- **`.dockerignore` gotchas** — uses its own glob syntax (not `.gitignore`); `!` exception rules are tricky.
- **Secrets in build args** — `ARG SECRET_KEY` leaks in `docker history`; use `--secret` with BuildKit instead.

Details: [references/edge-cases.md](references/edge-cases.md)

### Decision trees (summary)

- **Base image** (distroless vs Alpine vs slim), **multi-stage requirement**, **Compose vs Kubernetes**, **bind vs named volume** — see trees.

Details: [references/decision-tree.md](references/decision-tree.md)

### Anti-patterns (summary)

- Root in prod, secrets in layers, bad layer order, missing `.dockerignore`, `latest` tags — see reference.

Details: [references/anti-patterns.md](references/anti-patterns.md)

### Suggested response format (implement / review)

1. **Issue or goal** — Dockerfile problem, size optimization request, or compose design question.
2. **Recommendation** — Build strategy, base image choice, or compose pattern.
3. **Code** — Dockerfile or `docker-compose.yml` snippet with explanatory comments.
4. **Residual risks** — Security gaps, caching pitfalls, or platform compatibility issues.

## Resources in this skill

- `references/` — topic deep-dives; do not paste entire reference docs into SKILL.md.

| Topic | File |
|-------|------|
| **Dockerfile authoring** | [references/dockerfile.md](references/dockerfile.md) |
| Image optimization | [references/image-optimization.md](references/image-optimization.md) |
| Docker Compose | [references/compose.md](references/compose.md) |
| Tips and tricks | [references/tips-and-tricks.md](references/tips-and-tricks.md) |
| Edge cases | [references/edge-cases.md](references/edge-cases.md) |
| Decision trees | [references/decision-tree.md](references/decision-tree.md) |
| Anti-patterns | [references/anti-patterns.md](references/anti-patterns.md) |

## Quick example

### 1 — Simple (common)

**Input:** Node.js app Dockerfile is 1.2 GB and takes 4 minutes to build from scratch every time.  
**Expected output:** Multi-stage Dockerfile separating build and runtime, with `COPY package*.json` before source for npm cache, `node:20-alpine` runtime base, non-root user, `.dockerignore` excluding `node_modules`; expected final image under 150 MB.

### 2 — Tricky (edge case)

**Input:** Production container runs as root because “fixing permissions was hard”; need to bind-mount uploads.  
**Expected output:** Create non-root `USER` with `COPY --chown`, align volume UID/GID, avoid root; document host compatibility from [edge-cases.md](references/edge-cases.md).

### 3 — Cross-skill

**Input:** CI builds Docker image then deploys — builds are slow and registry fills with `latest` tags.  
**Expected output:** **`docker-pro`** layer cache + BuildKit; **`ci-cd-pro`** digest-pinned deploys; **`deployment-pro`** rollout policy.

## Checklist before calling the skill done

- [ ] Multi-stage build: build artifacts copied to minimal runtime image.
- [ ] `.dockerignore` present and excludes `node_modules`, `.git`, test files, secrets.
- [ ] Non-root user defined and applied with `USER`.
- [ ] `HEALTHCHECK` instruction present for long-running services.
- [ ] No secrets in `ARG`, `ENV`, or baked into image layers; use BuildKit `--secret` for build-time secrets.
- [ ] Layer order optimized: dependencies installed before source code copied.
- [ ] Base image choice matches libc/native dependency needs (Alpine vs Debian).
