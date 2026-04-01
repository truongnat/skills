# Docker — Edge cases

## PID 1 and signal handling

- `CMD ["node", "index.js"]` (exec form): node is PID 1; doesn't forward SIGTERM by default → container hangs on stop.
- Fix: use `tini`/`dumb-init` as init, or handle SIGTERM in app code.

```js
process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
```

## Shell vs exec form

```dockerfile
# Shell form — wraps in /bin/sh -c; signal NOT forwarded to process
CMD node index.js

# Exec form — runs directly as PID 1; signal IS forwarded
CMD ["node", "index.js"]
```

Always use exec form for `CMD` and `ENTRYPOINT` in production.

## ENTRYPOINT vs CMD

- `ENTRYPOINT` — the executable; cannot be overridden without `--entrypoint`.
- `CMD` — default arguments; overridden by `docker run <image> <args>`.
- Combine: `ENTRYPOINT ["node"]` + `CMD ["dist/index.js"]` allows `docker run img dist/other.js`.

## Volume permissions on Linux

Bind-mounted directories use the host UID. If container user is UID 1001 and host file is owned by UID 1000 → permission denied.

Fix options:
1. Match UIDs: `adduser -u 1000 appuser` in Dockerfile.
2. `chmod`/`chown` the bind-mounted path on host.
3. Use named volumes (Docker manages ownership).

## Alpine musl libc gotchas

- Native Node.js modules compiled for glibc won't run on Alpine (musl).
- Solutions: use `node:slim` (Debian), or add `libc6-compat` to Alpine.
- `bcrypt` and `sharp` are common offenders.

## ARG secrets leak in history

```bash
docker history myimage  # shows ARG values in build commands
```

Never use `ARG SECRET_KEY` for real secrets. Use BuildKit `--secret`:

```dockerfile
RUN --mount=type=secret,id=secret_key \
    SECRET=$(cat /run/secrets/secret_key) && ...
```

## Layer count limit

Docker has a soft limit around 127 layers. Chain `RUN` commands to avoid hitting it in large Dockerfiles.

## .dockerignore doesn't follow .gitignore syntax exactly

- Uses Docker's own pattern matching — slightly different from gitignore.
- `**` matches any depth, but must be explicitly used.
- Exception rules (`!pattern`) must come after the ignore pattern.

```
node_modules
!node_modules/.bin  # OK — exception after the rule
```
