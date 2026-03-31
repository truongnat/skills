---
name: nextjs-pro
description: |
  Professional Next.js development: App Router, Server Components, data fetching and caching, Route Handlers, middleware, and deployment-aware edge cases.

  Use this skill when the user works on Next.js (Pages or App Router), `next.config`, `next/image`, `next/font`, `next/link`, layouts, `loading.tsx`, `error.tsx`, Server Actions, `fetch` caching and revalidation, `cookies()` / `headers()` in RSC, Middleware, Edge Runtime, Route Handlers, internationalization (next-intl / i18n), Turbopack, Vercel deployment, or asks for review of RSC boundaries, hydration, or API routes.

  Triggers: "Next.js", "Nextjs", "App Router", "Pages Router", "Server Component", "RSC", "use client", "Server Action", "next/navigation", "next/image", "middleware.ts", "revalidate", "fetch cache", "Route Handler", "edge runtime", "Turbopack", "next.config", "Vercel", "parallel routes", "intercepting routes", "generateStaticParams", "dynamic route", "metadata API", "next/font".

metadata:
  short-description: Next.js — App Router, RSC, caching, middleware, ops
---

# Next.js (professional)

Use official [Next.js docs](https://nextjs.org/docs) for version-specific APIs; this skill encodes **framework-correct patterns**, **server/client boundaries**, and **production edge cases**. Confirm **Next.js major** (13/14/15+) and **App vs Pages Router** from the project.

Generic React patterns (hooks, JSX discipline): skill **`react-pro`**.

## When to use

- Structuring **App Router** trees: layouts, templates, loading/error boundaries, route groups.
- Choosing **Server vs Client Components** and fixing boundary mistakes (`"use client"` placement).
- **Data fetching**: `fetch` in RSC, caching, `revalidatePath` / `revalidateTag`, `unstable_cache` patterns.
- **Mutations**: Server Actions vs Route Handlers; form handling and progressive enhancement.
- **Middleware**, auth redirects, matchers, Edge vs Node runtime.
- **Deployment**: environment variables, `output: standalone`, image domains, region/runtime constraints.

## Operating principles

1. **Default to the server** — Push data fetching and heavy IO to Server Components unless interactivity requires client.
2. **Minimize client bundle** — `use client` only for subtrees that need hooks or browser APIs.
3. **Caching is explicit** — Understand `fetch` cache, `dynamic`, `revalidate`, and opt-out (`cache: 'no-store'`, `dynamic = 'force-dynamic'`) per route.
4. **Secrets never in client** — API keys and tokens stay server-side (RSC, Route Handlers, env without `NEXT_PUBLIC_`).
5. **Colocate route concerns** — `loading`/`error` per segment; avoid global catch-alls when segment-level UX is better.

## App Router and layouts (summary)

- **Layouts** persist across navigations; **templates** remount — pick based on whether state should reset.
- **`page.tsx`** is a Server Component by default; leaf client components import `"use client"` at top of file.
- **Parallel and intercepting routes** — powerful for modals; easy to mis-wire URLs — test deep links.

Details: [references/app-router-and-layouts.md](references/app-router-and-layouts.md)

## Server and client boundaries (summary)

- No `useState` / `useEffect` in Server Components; move UI state to a client child.
- **Pass serializable props** from server to client (no functions unless documented patterns like Server Actions).
- **`cookies()` / `headers()`** — dynamic APIs; may force dynamic rendering — understand cost.

Details: [references/server-client-boundaries.md](references/server-client-boundaries.md)

## Tips and tricks (summary)

- **`next/link`** — client navigation; prefetch behavior differs from `<a>`; use for in-app routes.
- **`next/image`** — configure `remotePatterns` / `domains`; know layout vs fill and LCP impact.
- **Server Actions** — idempotent where possible; validate on server; rate-limit sensitive actions.
- **Middleware** — runs on Edge by default; avoid Node-only APIs unless configured.

Details: [references/tips-and-tricks.md](references/tips-and-tricks.md)

## Edge cases (summary)

- **Hydration mismatches** — client-only data in SSR HTML; use `suppressHydrationWarning` only with reason.
- **Dynamic APIs** in static routes — accidentally pulling `headers()` into a page that should be static.
- **Edge Runtime** — subset of Node APIs; Prisma and some SDKs need Node runtime or data proxy.
- **i18n** — locale in path vs domain; `middleware` matcher scope.

Details: [references/edge-cases.md](references/edge-cases.md)

## Suggested response format (implement / review)

1. **Issue or goal** — Route, data, or deploy context.
2. **Recommendation** — Next pattern + server/client split.
3. **Code** — File paths (`app/...`) and snippets aligned with App Router.
4. **Residual risks** — Caching surprises, env, or runtime limits.

## Pre-merge checklist

- [ ] `"use client"` only where needed; no accidental client boundary too high in tree.
- [ ] Fetch/cache behavior matches product (stale data vs freshness).
- [ ] Secrets and DB credentials only on server.
- [ ] `next/image` and remote patterns configured for production domains.
- [ ] Middleware matcher does not over-run on static assets.

## References

| Topic | File |
|-------|------|
| App Router and layouts | [references/app-router-and-layouts.md](references/app-router-and-layouts.md) |
| Server / client boundaries | [references/server-client-boundaries.md](references/server-client-boundaries.md) |
| Tips and patterns | [references/tips-and-tricks.md](references/tips-and-tricks.md) |
| Edge cases and ops | [references/edge-cases.md](references/edge-cases.md) |
