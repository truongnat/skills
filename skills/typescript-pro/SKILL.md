---
name: typescript-pro
description: |
  Professional TypeScript development: type system depth, compiler configuration, generics, utility types, strict mode, declaration files, and migration from JavaScript.

  Use this skill when the user works on TypeScript, tsconfig, type inference, generics, mapped/conditional/template-literal types, utility types (Partial, Required, Pick, Omit, Record, ReturnType, etc.), declaration files (.d.ts), type narrowing, discriminated unions, module resolution, path aliases, strict null checks, type guards, satisfies operator, const assertions, or migrating JavaScript to TypeScript.

  Triggers: "TypeScript", "tsconfig", "type error", "TS2322", "TS2532", "TS18048", "generic", "interface", "type alias", "infer", "conditional type", "mapped type", "utility type", "ReturnType", "Partial", "Pick", "Omit", "satisfies", "as const", ".d.ts", "declaration file", "strict mode", "noImplicitAny", "exactOptionalPropertyTypes", "module resolution", "path alias", "NodeNext", "verbatimModuleSyntax", "tsc", "type guard", "discriminated union", "never", "unknown", "keyof", "typeof", "branded type".

metadata:
  short-description: TypeScript — type system, generics, strict config, migration
---

# TypeScript (professional)

Use official [TypeScript docs](https://www.typescriptlang.org/docs/) for language reference; this skill encodes **type system discipline**, **compiler configuration best practices**, and **edge-case awareness** (inference limits, module resolution, declaration merging). Confirm **TypeScript version**, **tsconfig `strict` settings**, and **module system** (`ESM` vs `CJS`) when known.

## Related skills (this repo)

| Skill | When to combine |
|-------|----------------|
| `javascript-pro` | When JS runtime behavior (closures, prototypes, async) underlies the TS issue |
| `react-pro` | TSX, component prop types, hook generics |
| `nextjs-pro` | App Router types, `metadata`, server/client component boundaries |
| `nestjs-pro` | Decorator metadata, controller/service types |
| `testing-pro` | Typing test utilities, mock types |

## When to use

- Designing interfaces, type aliases, generics, and utility types for domain models.
- Debugging type errors: excess property checks, `never`, widening, narrowing, contextual typing.
- Configuring `tsconfig.json` for strict correctness and module compatibility.
- Writing declaration files for JS libraries or augmenting third-party types.
- Migrating a JavaScript codebase to TypeScript incrementally.
- Trigger keywords: `TypeScript`, `tsconfig`, `generic`, `type error`, `infer`, `conditional type`, `strict`, `discriminated union`, `.d.ts`, …

## Workflow

1. Confirm TypeScript version, `strict` flags in `tsconfig.json`, and module system (ESM/CJS/NodeNext).
2. Apply the principles and topic summaries below; open `references/` when you need depth.
3. Respond using **Suggested response format**; call out breaking type changes and migration risks.

### Operating principles

1. **Enable strict mode** — `"strict": true` catches the most bugs; enable per-flag only when migrating incrementally.
2. **Prefer `unknown` over `any`** — forces explicit narrowing; reserve `any` for genuine escape hatches with a comment.
3. **Type at boundaries** — strongest types at external input (API responses, user input, env vars); let inference flow inward.
4. **Narrow explicitly** — use type guards, discriminated unions, and `satisfies` rather than assertions.
5. **Generics express relationships** — a generic `<T>` should connect input to output; avoid generics that just rename `unknown`.
6. **Avoid type gymnastics** — complex mapped/conditional types should live in `references/` with documentation; keep call-site types readable.

### Type system depth (summary)

- **Generics** — constrain with `extends`; use `infer` for extraction inside conditional types; default type parameters for convenience.
- **Mapped types** — `{ [K in keyof T]: ... }` for transformations; `+readonly`/`-?` modifiers to add/remove flags.
- **Conditional types** — `T extends U ? X : Y`; distributive over unions; `infer` captures sub-types.
- **Template literal types** — combine string unions: `` `on${Capitalize<E>}` `` for event maps.
- **Utility types** — `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `ReturnType`, `Parameters`, `Awaited`, `NonNullable`.

Details: [references/type-system.md](references/type-system.md)

### Compiler configuration (summary)

- **`target`** — JS output level; set to the minimum runtime you support.
- **`module` / `moduleResolution`** — use `NodeNext` for Node ESM; `Bundler` for Vite/webpack; match `module` and `moduleResolution`.
- **`paths` and `baseUrl`** — path aliases require bundler/loader support; document the mapping.
- **`isolatedModules`** — required for transpile-only tools (esbuild, SWC, Babel); bans `const enum` and `namespace` merging.
- **`declaration` + `declarationMap`** — emit `.d.ts` for libraries; sourcemaps for IDE navigation.

Details: [references/tsconfig.md](references/tsconfig.md)

### Tips and tricks (summary)

- **`satisfies` operator** — validate shape without widening: `const config = { ... } satisfies Config`.
- **`as const`** — narrow literal types; use for enum-like objects and route tables.
- **Discriminated unions** — add a literal `kind` or `type` field; exhaustive checks with `never` in the default branch.
- **Type narrowing** — `typeof`, `instanceof`, `in`, custom type predicates (`is`), assertion functions.
- **Module augmentation** — extend third-party types with `declare module 'pkg' { ... }` in `.d.ts` files.

Details: [references/tips-and-tricks.md](references/tips-and-tricks.md)

### Edge cases (summary)

- **Excess property checks** — only on fresh object literals; assign to variable first to bypass (intentionally).
- **Variance** — function parameters are bivariant by default under `strictFunctionTypes`; return types are covariant.
- **`isolatedModules` gotchas** — must use `import type` for type-only imports; no `const enum`.
- **Declaration merging** — `interface` merges; `type` does not; prefer `interface` for extensible public APIs.
- **`noUncheckedIndexedAccess`** — adds `| undefined` to indexed access; enables safer array/record reads.

Details: [references/edge-cases.md](references/edge-cases.md)

### Anti-patterns (summary)

- **`as` silencing**, **`any` in public APIs**, **path alias mismatch** — [references/anti-patterns.md](references/anti-patterns.md).

### Integration with other skills (summary)

- **`react-pro`**, **`nestjs-pro`**, **`testing-pro`** — [references/integration-map.md](references/integration-map.md).

### Suggested response format (implement / review)

1. **Issue or goal** — Type error, design question, or migration task.
2. **Recommendation** — Type strategy, tsconfig change, or refactor approach.
3. **Code** — TypeScript snippets with inline type annotations or diff-style blocks.
4. **Residual risks** — Breaking type changes, inference surprises, or runtime/compile mismatches.

## Resources in this skill

- `references/` — topic deep-dives; do not paste entire reference docs into SKILL.md.

| Topic | File |
|-------|------|
| **Type system depth** | [references/type-system.md](references/type-system.md) |
| Compiler config | [references/tsconfig.md](references/tsconfig.md) |
| Tips and tricks | [references/tips-and-tricks.md](references/tips-and-tricks.md) |
| Edge cases | [references/edge-cases.md](references/edge-cases.md) |
| Anti-patterns | [references/anti-patterns.md](references/anti-patterns.md) |
| Decision trees | [references/decision-tree.md](references/decision-tree.md) |
| Version notes | [references/versions.md](references/versions.md) |
| Integration map | [references/integration-map.md](references/integration-map.md) |

## Quick example

### 1 — Simple (common)

**Input:** TypeScript error `Type 'string | undefined' is not assignable to type 'string'` after enabling `strictNullChecks`.  
**Expected output:** Explain null narrowing; show `if (x !== undefined)` guard, optional chaining `x?.trim()`, and nullish coalescing `x ?? 'default'`; note when to use non-null assertion `!` and when not to.

### 2 — Tricky (edge case)

**Input:** `satisfies` vs `: Config` vs `as Config` for a large config object — which to pick?  
**Expected output:** Prefer `satisfies Config` to validate without widening literals; use `: Config` when intentional widening; reserve `as` for narrow escape with comment.

### 3 — Cross-skill

**Input:** React component props typed with `any` for `children` and event handlers.  
**Expected output:** **`typescript-pro`** for `ReactNode`, `ComponentProps`, `MouseEvent` typing; **`react-pro`** for whether composition/API is idiomatic.

## Checklist before calling the skill done

- [ ] `strict: true` (or explicit flags) enabled; no unintentional `any` without comment.
- [ ] Generics constrain and connect types rather than being aliases for `unknown`.
- [ ] `tsconfig.json` `module`/`moduleResolution` match the build tool.
- [ ] Discriminated unions or type guards used for narrowing; no blind `as` casts.
- [ ] `import type` used for type-only imports when `isolatedModules` is enabled.
- [ ] External input validated at boundaries (schema) when runtime shape matters.
- [ ] `satisfies` / `as const` considered before widening or assertion.
- [ ] Public library APIs use `interface` for extensibility; `.d.ts` emitted if publishing.
