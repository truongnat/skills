# Improvement Plan — Skills, Rules, Workflows, Prompts & Templates

> **Objective:** Elevate every layer of this repo from a functional scaffold to a high-value, deeply reasoned knowledge system that produces beautiful, actionable output every time.

---

## Diagnosis — What Is Currently Basic

| Layer | Current state | Gap |
|-------|--------------|-----|
| **Skills** | SKILL.md + thin `references/` summaries; 3–7 operating principles; single Quick Example | Missing decision trees, anti-patterns, version-specific tables, integration maps, depth in references |
| **Authoring Rules** | 9 structural rules, section order checklist | No quality rubric, no examples of "good vs bad", no prompt engineering guidance for skill consumers |
| **Workflows** | 5 workflows (ticket, hotfix, release, debug, code-review); steps described but no branching | No rollback/error branches, no alternative paths, missing major workflows, no output format contract |
| **Prompts** | 1 template (example-skill-assisted-task.md); no chains | Missing 20+ prompt patterns; no role-aware system prompts; no multi-step chains |
| **Templates** | Monolith `PROMPT_TEMPLATES.md`; single skill template | No issue/PR/ADR/report templates; prompt templates not organized by job-to-be-done |
| **Output formatting** | Plain tables + bullets; no visual severity; no callout blocks | Reports look identical regardless of severity; no standard "beautiful output" conventions |

> **Note:** The table above is a **historical baseline** (plan inception), not a live dashboard. See **[Implementation status](#implementation-status)** so it is not read as current truth.

---

## Implementation status

Rolling snapshot so maintainers do not confuse **Diagnosis** with “nothing has been done.”

| Layer | Status (2026-04) | Notes |
|-------|------------------|-------|
| **Skills** | In progress | Depth waves (references, anti-patterns, three Quick examples, etc.) ongoing; not every skill meets §1.1 tier targets yet |
| **Authoring rules** | Largely done | §10–§12 (rubric, consumer guidance, update-vs-add) in [`skills/SKILL_AUTHORING_RULES.md`](skills/SKILL_AUTHORING_RULES.md) |
| **Workflows** | Expanded | Beyond the original five; see [`workflows/dev/README.md`](workflows/dev/README.md) — diagnosis row predates many additions |
| **Prompts** | Partial | `prompts/` tree by job exists; **§4.2** Few-shot + Chain is **not** in every file — audit backlog in [`prompts/README.md`](prompts/README.md) (section **IMPROVEMENT_PLAN §4.2 compliance**) |
| **Templates** | Partial | Report/issue/kb scaffolds exist; [`templates/PROMPT_TEMPLATES.md`](templates/PROMPT_TEMPLATES.md) remains a monolith **index** |
| **Output formatting** | Done | [`OUTPUT_CONVENTIONS.md`](OUTPUT_CONVENTIONS.md) at repo root |

### Phase checklist (roadmap alignment)

| Phase | Item | Status |
|-------|------|--------|
| 1 | `OUTPUT_CONVENTIONS.md` + core report templates + SKILL §10–12 + `w-code-review` / `w-debug` contracts | Done |
| 2 | Priority skill depth (react, nextjs, security, testing, typescript) | Done (ongoing polish OK) |
| 3 | New workflows (security, arch, perf, refactor, incident + extended set in `workflows/dev/`) | Done |
| 4 | `prompts/` JTBD tree + priority prompts | Done (Few-shot / Chain: next step not universal) |
| 5 | Report templates (performance, incident, issue, kb, workflow scaffold) + split `PROMPT_TEMPLATES` guidance | Partial — monolith retained as legacy index; granular prompts canonical |
| 6 | Remaining skill depths (nestjs, postgresql, docker, ci-cd, ai-integration; mid-tier anti-patterns) | In progress |
| — | CI (`validate-skills`, `build-kb`, `verify-kb`) | Done ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) |
| — | Claude Code `/w-*` parity | Done (`.claude/commands/` mirrors `.cursor/commands/`) |
| — | Report templates: test-strategy, dependency-audit, debug-report | Done |

### Tooling convention (skills index)

After **substantive** changes to bundled skill content (`skills/**/SKILL.md` or `references/` text that affects discovery/embeddings), run:

```bash
node dist/tools.js build-skill-index
```

Also run **`node dist/tools.js validate-skills`** when frontmatter or folder `name` changes. Documented in [`skills/SKILL_AUTHORING_RULES.md`](skills/SKILL_AUTHORING_RULES.md) §8.

---

## Part 1 — Skills

### 1.1  Deepen every SKILL.md

Each skill should move from "reference card" to "expert in a box." Concretely, update every skill's `SKILL.md` with:

#### Operating principles — raise the bar from 5 to 10+
Current principles are top-level reminders. They need to be **decision-forcing** — enough detail that an agent can choose between two valid approaches.

**Pattern to follow (react-pro example, before → after):**

```
BEFORE (current):
3. Lists need stable keys — Prefer domain ids over array index when order/content changes.

AFTER (target):
3. **Stable keys prevent state corruption** — Use a domain-stable id (DB id, slug,
   uuid) as `key`. Use index ONLY for truly static, never-reordered, never-filtered
   lists (e.g. a hardcoded nav). Warn the user when mutation + index keys co-exist —
   the bug is usually invisible until items are deleted or reordered.
   Decision: if the list can be filtered, sorted, or mutated → mandate stable id.
```

#### Anti-patterns section (add to every skill)
A dedicated `### Anti-patterns` section in SKILL.md listing the top 5–8 things that look reasonable but are wrong in this domain. Example for `react-pro`:
- Calling hooks conditionally to "skip" work
- Putting derived state in `useState` when it could be computed during render
- `useEffect` with an empty dep array to run "once" when the real fix is derived state
- Spreading `{...props}` onto DOM elements (unknown prop warnings + security)

#### Decision tree (add to `references/decision-tree.md` per skill)
For the 3–5 most common "which approach should I use?" questions, write a binary decision tree in Markdown. Example for `security-pro`:

```
Storing user tokens:
├── Is this a browser web app?
│   ├── Yes → HttpOnly cookie (not localStorage) unless SPA/CORS constraint
│   │   └── CORS constraint? → memory-only store + short TTL + refresh token rotation
│   └── No (native/mobile) → Keychain (iOS) / Keystore (Android); see flutter-pro/react-native-pro
└── Is this a server-to-server integration?
    └── → Short-lived service account token in Vault/CI secrets; never hardcoded
```

#### Version matrix (add to `references/versions.md` per skill where relevant)
Skills like `react-pro`, `nextjs-pro`, `nestjs-pro`, `postgresql-pro` depend heavily on version. Add a table:

| Feature | Version introduced | Migration note |
|---------|-------------------|----------------|
| App Router (stable) | Next.js 13.4 | `pages/` still supported; not deprecated |
| Server Actions (stable) | Next.js 14 | replaces API routes for form mutations |
| `use cache` directive | Next.js 15 | replaces `fetch` cache options |

#### Integration map (add to `references/integration-map.md` per skill)
A table of "when you use THIS skill, you will likely also need THESE" with the exact reason:

| Combined skill | Why | What THIS skill owns | What the other owns |
|---|---|---|---|
| `security-pro` | Auth flows | JWT/session policy + threat model | Guards, ValidationPipe, exception filter wiring |
| `testing-pro` | Test coverage | Abuse-case scenarios, SAST/DAST hooks | Test file structure, RTL/Vitest patterns |

#### More `references/` depth — minimum files per skill tier

| Skill tier | Minimum reference files |
|---|---|
| Core domain (`react-pro`, `nestjs-pro`, `postgresql-pro`, `security-pro`, `testing-pro`) | `tips-and-tricks.md`, `edge-cases.md`, `decision-tree.md`, `versions.md`, `integration-map.md`, `anti-patterns.md` + 1–2 domain-specific |
| Mid-tier (`typescript-pro`, `docker-pro`, `ci-cd-pro`, `auth-pro`, `caching-pro`) | `tips-and-tricks.md`, `edge-cases.md`, `decision-tree.md`, `anti-patterns.md` |
| Support (`planning-pro`, `feedback-pro`, `git-operations-pro`) | `tips-and-tricks.md`, `edge-cases.md` |

#### Quick example — expand from 1 to 3
Every skill needs three examples:
1. **Simple, common** — the 80% use case
2. **Tricky** — an edge case the user is likely to get wrong
3. **Cross-skill** — a scenario that requires combining this skill with 1–2 others

---

### 1.2  Priority skills to deepen first (highest user value)

These skills are invoked most often and benefit most from depth:

| # | Skill | Missing depth |
|---|-------|--------------|
| 1 | `react-pro` | decision-tree (hooks vs derived state), anti-patterns, React 19 changes |
| 2 | `nextjs-pro` | App Router vs Pages Router decision table, Server Actions vs API routes, `use cache` |
| 3 | `security-pro` | per-threat decision tree (authn vs authz vs data exposure), ASVS checklist refs |
| 4 | `testing-pro` | test pyramid decision tree, RTL anti-patterns, mutation testing guide |
| 5 | `typescript-pro` | type narrowing patterns, generics cookbook, `satisfies` vs `as` vs type annotation |
| 6 | `nestjs-pro` | module design decisions, Guard vs Middleware vs Interceptor decision tree |
| 7 | `postgresql-pro` | index decision tree (B-tree vs GIN vs partial), RLS pattern library |
| 8 | `ci-cd-pro` | GitHub Actions matrix guide, secrets injection patterns, deployment gates |
| 9 | `docker-pro` | multi-stage build patterns, layer caching guide, distroless vs Alpine decision |
| 10 | `ai-integration-pro` | tool use patterns, system prompt engineering, streaming + error handling |

---

## Part 2 — Authoring Rules

### 2.1  Add a quality rubric to `SKILL_AUTHORING_RULES.md`

The current rules tell you **what structure** to follow. They do not tell you **what good looks like**. Add:

#### §10 — Quality rubric (new section)

```markdown
## 10. Quality rubric — what "good" looks like

Rate each section before merging. A skill is ready when it scores ≥ 4 on every row.

| Dimension | 1 (weak) | 3 (acceptable) | 5 (strong) |
|-----------|---------|----------------|------------|
| **Operating principles** | Generic advice ("use best practices") | Concrete rules with brief rationale | Decision-forcing: tells the agent which option to pick when two valid choices exist |
| **Trigger coverage** | Misses common user phrasings | Covers the obvious terms | Includes slang, version names, error message fragments, and adjacent concepts |
| **Reference depth** | Single file, mostly bullets | 2–3 files, some code examples | 4+ files; each has code, an anti-pattern, and a "when NOT to use" note |
| **Quick examples** | 1 simple example | 1 example + 1 edge case | 3 examples: simple, tricky, cross-skill |
| **Checklist** | 3–4 vague items | 5–6 specific items | 7+ items, each verifiable by the agent without human judgment |
```

#### §11 — Prompt-engineering guidance for skill consumers (new section)

When an agent invokes a skill, the quality of the output depends on the invocation. Add guidance on:
- How to phrase the context: include stack, constraints, severity, and what has already been tried
- What NOT to ask in one invocation: never ask a skill to plan + implement + review in the same prompt
- How to combine skills: name both skills explicitly; state which owns what

#### §12 — "When to update vs when to add" decision (new section)

A common question is whether to update an existing skill or add a new one when a new topic arises. Add a clear decision tree:

```
New topic arrives:
├── Is it covered in §1's exclusion list?
│   └── Yes → Find the existing skill and open a references/ PR instead
├── Would adding it to an existing skill exceed 300 lines of SKILL.md?
│   └── Yes → Split: existing skill + sibling sub-skill (e.g. react-pro + react-server-pro)
└── Is it a distinct job-to-be-done with different trigger keywords?
    └── Yes → New skill; satisfy §1–§9 before merging
```

---

## Part 3 — Workflows

### 3.1  Deepen existing workflows

Every workflow step should add:

**a) Decision branch** — "if X, skip to step N; if Y, go to step N+1"
**b) Rollback / error path** — what to do when a step fails
**c) Output format contract** — not just "produces a report" but a Markdown template of what the report looks like

#### Example: `w-code-review.md` — what to add

**Step 2 (correctness-review) — add decision branch:**
```
Decision: If the diff touches > 500 lines, prioritize by risk tier:
  Tier 1 (always review): auth, payments, data deletion, migrations
  Tier 2 (review if time): business logic, API surface
  Tier 3 (sample only): formatting, pure UI
```

**Step 7 (compile) — add output format contract:**
```
## Review Report — {{pr_title}} ({{date}})

> **Verdict:** 🔴 DO NOT MERGE / 🟡 MERGE WITH FIXES / 🟢 APPROVE

### Risk summary
[2–3 sentences: overall quality + top risk + merge recommendation]

### 🔴 Blockers  (must fix before merge)
- **`path/to/file.ts:L45`** — [issue]
  → [recommendation]
  ```ts
  // fix example
  ```

### 🟡 Important  (should fix)
...

### 🟢 Minor  (optional)
...

### ✅ Praise
...
```

### 3.2  Add new workflows (high priority)

| Workflow | File | Why needed |
|----------|------|-----------|
| Architecture review | `w-arch-review.md` | No structured way to review system design decisions |
| Security audit | `w-security-audit.md` | `security-pro` is a skill but there's no audit workflow |
| Performance investigation | `w-perf-investigation.md` | Performance regressions need a repeatable playbook |
| Incident response | `w-incident.md` | Production incidents need a structured response |
| Data migration | `w-data-migration.md` | DB migrations are high-risk; need a safety checklist workflow |
| Onboarding | `w-onboarding.md` | New engineers / agents need a structured ramp-up path |
| Refactoring | `w-refactor.md` | Refactors without tests and planning often introduce regressions |
| API design review | `w-api-design.md` | REST/GraphQL API design needs structured review before implementation |
| Testing strategy | `w-test-strategy.md` | Choosing what to test and how requires structured thinking |
| Dependency audit | `w-dep-audit.md` | Supply-chain risk review of package.json / lock files |

### 3.3  New workflow file structure — enhanced contract

Every new workflow must include these sections beyond the current standard:

```markdown
## Decision paths
<!-- When to skip a step, when to repeat, when to abort -->

## Error handling
<!-- What to do when a step fails; rollback steps -->

## Output format
<!-- Exact Markdown template for the final artifact -->

## Time estimate
<!-- Rough guidance: Quick (<30min), Standard (1–3h), Deep (>3h) -->

## Escalation
<!-- When to involve a human vs continue autonomously -->
```

---

## Part 4 — Prompts

### 4.1  Organize `prompts/` by job-to-be-done

Replace the single `templates/` subfolder with a proper directory tree:

```
prompts/
  README.md
  planning/
    feature-planning.md       (expand existing example)
    architecture-decision.md
    sprint-breakdown.md
    risk-assessment.md
  review/
    code-review-request.md
    security-review-request.md
    performance-review-request.md
    api-review-request.md
  debugging/
    bug-report.md
    root-cause-analysis.md
    performance-profiling.md
  generation/
    new-feature.md
    refactoring-task.md
    test-generation.md
    documentation-generation.md
    migration-script.md
  analysis/
    codebase-audit.md
    dependency-audit.md
    skill-gap-analysis.md
  chains/
    plan-then-implement.md    (multi-step chain)
    review-then-fix.md
    debug-then-document.md
```

### 4.2  Standard prompt template structure (enhanced)

Every prompt file must follow this structure (richer than current):

```markdown
# {{prompt-name}}

## Metadata
| Field | Value |
|-------|-------|
| version | 1.0 |
| category | planning / review / debugging / generation / analysis |
| skills | comma-separated *-pro skills this prompt activates |
| model-guidance | sonnet (balanced) / opus (complex reasoning) / haiku (fast/cheap) |
| output-format | report / code / list / decision |

## Purpose
One paragraph: what job this prompt solves; when to use it vs similar prompts; what it does NOT do.

## Variables
| Name | Required | Type | Description | Example |
|------|----------|------|-------------|---------|
| `variable` | Yes/No | string/list/bool | description | "example value" |

## System prompt
[persona + constraints + output format instructions + quality bar]

## User prompt (template)
[structured prompt with {{variable}} placeholders]

## Few-shot examples
### Example 1 — [simple/common scenario]
**Input:** variable values
**Expected output shape:** [brief description or short excerpt]

### Example 2 — [edge case]
...

## Chain: next step
> If this prompt produces X, follow with: [next prompt file path]
```

### 4.3  Key prompts to write first

| Priority | Prompt | Why |
|----------|--------|-----|
| 1 | `planning/feature-planning.md` | Upgrade the single existing template; add model guidance + chain |
| 2 | `debugging/bug-report.md` | Most common engineering task; needs structured output |
| 3 | `review/code-review-request.md` | Companion to `w-code-review` workflow |
| 4 | `generation/new-feature.md` | Architecture + stack-aware feature scaffolding |
| 5 | `generation/test-generation.md` | Generate tests from requirements/code |
| 6 | `analysis/codebase-audit.md` | Understand an unfamiliar codebase quickly |
| 7 | `review/security-review-request.md` | Security-focused prompt tied to `security-pro` |
| 8 | `chains/plan-then-implement.md` | Multi-step: plan → review plan → implement → write tests |
| 9 | `generation/refactoring-task.md` | Structured refactor with safety guarantees |
| 10 | `debugging/root-cause-analysis.md` | Systematic RCA prompt tied to `w-debug` workflow |

---

## Part 5 — Templates

### 5.1  Split `templates/PROMPT_TEMPLATES.md` into individual files

The current `templates/PROMPT_TEMPLATES.md` is a 21KB monolith. Break it into:

```
templates/
  README.md              (index)
  skill/
    SKILL.md             (existing skill template — unchanged)
  workflow/
    w-template.md        (workflow authoring template)
  prompt/
    prompt-template.md   (prompt authoring template — §4.2 above)
  report/
    code-review.md       (report output template)
    security-audit.md
    performance-report.md
    incident-report.md
    architecture-decision-record.md   (ADR template)
  issue/
    bug-report.md        (issue-tracker bug template)
    feature-request.md
  kb-document/
    knowledge-doc.md     (template for knowledge-base/documents/)
```

### 5.2  New report templates (focus on beautiful output)

Every report template defines the exact visual structure agents must produce. This is what makes output beautiful and consistent.

#### `templates/report/code-review.md`

```markdown
# Code Review — {{pr_title}}

> **Date:** {{date}}  **Reviewer:** {{reviewer}}  **Target:** {{branch_or_pr}}

---

## Verdict

| | |
|--|--|
| **Decision** | 🔴 DO NOT MERGE \| 🟡 MERGE WITH FIXES \| 🟢 APPROVE |
| **Confidence** | High / Medium / Low |
| **Review scope** | Full \| Partial (note what was skipped) |

## Risk summary
<!-- 2–3 sentences -->

---

## 🔴 Blockers
> Must be resolved before merge.

### B1 — {{issue title}}
- **Location:** `path/to/file.ts:L42`
- **Issue:** [what is wrong and why it matters]
- **Recommendation:** [exact fix]
```ts
// code example
```

---

## 🟡 Important
> Should be resolved; would block in a stricter context.
...

## 🟢 Minor
> Optional improvements; do not block merge.
...

## ✅ Praise
> Highlight 1–3 genuinely good patterns.
...

---

## Action items
- [ ] B1 — fix auth check in `middleware.ts:45`
- [ ] I1 — extract N+1 query in `users/service.ts:120`
```

#### `templates/report/security-audit.md`

```markdown
# Security Audit Report — {{scope}}

> **Date:** {{date}}  **Auditor:** {{auditor}}  **Methodology:** OWASP ASVS L{{level}}

## Executive summary
<!-- 3–5 sentences: what was assessed, overall posture, top risks, recommended next steps -->

## Threat surface
| Surface | In scope | Notes |
|---------|----------|-------|
| Web frontend | ✅ | React SPA |
| API | ✅ | NestJS REST |
| Database | ✅ | PostgreSQL |
| Auth | ✅ | JWT + refresh |
| CI/CD | ❌ | Out of scope |

## Findings

### 🔴 Critical — {{count}} findings
#### C1 — {{title}}
- **OWASP / CWE:** A01:2021 — Broken Access Control / CWE-284
- **Location:** `src/auth/guards/admin.guard.ts`
- **Description:** [what the vulnerability is]
- **Exploit scenario:** [how an attacker would use it]
- **Recommendation:** [fix with code if applicable]
- **Verification:** [how to confirm the fix works]

### 🟠 High
...
### 🟡 Medium
...
### 🔵 Low / Informational
...

## Compliance mapping
| Control | ASVS ref | Status | Notes |
|---------|----------|--------|-------|
| Password hashing | V2.4.1 | ✅ Pass | bcrypt cost=12 |
| Token expiry | V3.3.1 | ⚠️ Partial | Access token TTL too long (24h) |

## Recommended remediation order
1. [Critical items — patch within 48h]
2. [High items — next sprint]
3. [Medium items — backlog with SLA]
```

#### `templates/report/architecture-decision-record.md`

```markdown
# ADR-{{number}}: {{title}}

> **Date:** {{date}}  **Status:** Proposed | Accepted | Deprecated | Superseded by ADR-N
> **Deciders:** {{names}}  **Skill context:** {{relevant *-pro skills}}

## Context
<!-- What situation prompted this decision? What forces are at play? -->

## Decision
<!-- The decision taken. Written as "We will ..." -->

## Options considered

### Option A — {{name}} ✅ (chosen)
**Pros:** ...
**Cons:** ...
**Risk:** Low / Medium / High

### Option B — {{name}}
**Pros:** ...
**Cons:** ...
**Risk:** ...

## Consequences
- **Positive:** ...
- **Negative / trade-offs:** ...
- **Follow-up required:** ...

## References
- [link to relevant SKILL.md or reference file]
```

---

## Part 6 — Output Formatting Conventions

This is the most impactful improvement: define a standard "beautiful output" convention that all agents follow.

### 6.1  Add `OUTPUT_CONVENTIONS.md` to repo root

This document becomes the visual style guide for all agent output. Key rules:

#### Severity emoji system (consistent across all output)
| Level | Emoji | Use in |
|-------|-------|--------|
| Critical / Blocker | 🔴 | Code review blockers, security critical, data-loss risk |
| High / Important | 🟡 | Should-fix issues, important warnings |
| Medium | 🟠 | Notable findings, consider addressing |
| Low / Minor | 🟢 | Optional improvements, style |
| Info / Praise | ✅ | Good patterns, passing checks |
| In progress | 🔵 | Active work, pending |
| Skipped | ⚪ | Out of scope, not reviewed |

#### Callout blocks (GitHub-flavored Markdown alerts)
Use these consistently in reports and workflow outputs:
```markdown
> [!NOTE]
> Informational context that helps the reader.

> [!TIP]
> A non-obvious best practice.

> [!WARNING]
> A risk or gotcha that could cause problems.

> [!CAUTION]
> Something that could cause data loss, security breach, or outage.
```

#### Report header standard
Every report artifact starts with:
```markdown
# {{Report Type}} — {{subject}}

> **Date:** {{ISO date}}  **Author/Agent:** {{name}}  **Version:** {{1.0}}
> **Status:** Draft | Final | Superseded
```

#### Code blocks — always include language hint
```typescript
// ✅ good
const handler = async (req: Request) => { ... }
```
```typescript
// ❌ avoid
const handler = async (req) => { ... }
```

#### Before/after comparison blocks
For recommendations, always use a split block:
```markdown
**Before** (current behavior):
```ts
// existing code with problem highlighted
```

**After** (recommended fix):
```ts
// fixed code
```
```

#### Progress / status tables
For workflows and audits:
```markdown
| Step | Status | Notes |
|------|--------|-------|
| Reproduce bug | ✅ Done | Repro in test/repro.test.ts |
| Root cause | 🔵 In progress | — |
| Fix | ⚪ Pending | — |
| Regression test | ⚪ Pending | — |
```

### 6.2  Update every workflow's "Suggested review format" to use the new conventions

Replace plain text format suggestions in workflows with explicit templates that use:
- Severity emojis
- Callout blocks for risks
- Before/after code comparisons
- Status tables for multi-step outputs

---

## Implementation Roadmap

### Phase 1 — Foundation (do first, unblocks everything else)
1. Write `OUTPUT_CONVENTIONS.md` — the visual contract all agents follow
2. Add `templates/report/code-review.md` and `templates/report/security-audit.md`
3. Add `templates/report/architecture-decision-record.md`
4. Update `SKILL_AUTHORING_RULES.md` with §10 (quality rubric), §11 (consumer guidance), §12 (update-vs-add decision)
5. Update `w-code-review.md` and `w-debug.md` to use new output conventions

### Phase 2 — Skill depth (highest impact per user session)
6. Deepen `react-pro`: anti-patterns + decision-tree + React 19 versions table
7. Deepen `security-pro`: per-threat decision tree + ASVS checklist reference
8. Deepen `nextjs-pro`: App Router vs Pages Router decision table + `use cache` guide
9. Deepen `testing-pro`: test pyramid decision tree + RTL anti-patterns
10. Deepen `typescript-pro`: type narrowing patterns + generics cookbook

### Phase 3 — New workflows
11. Add `w-security-audit.md`
12. Add `w-arch-review.md`
13. Add `w-perf-investigation.md`
14. Add `w-refactor.md`
15. Add `w-incident.md`

### Phase 4 — Prompts overhaul
16. Reorganize `prompts/` into job-to-be-done folders
17. Write `prompts/debugging/bug-report.md` and `prompts/review/code-review-request.md`
18. Write `prompts/chains/plan-then-implement.md`
19. Write `prompts/generation/test-generation.md` and `prompts/generation/new-feature.md`
20. Write `prompts/analysis/codebase-audit.md`

### Phase 5 — Templates overhaul
21. Split `templates/PROMPT_TEMPLATES.md` into individual files
22. Write `templates/report/performance-report.md` and `templates/report/incident-report.md`
23. Write `templates/issue/bug-report.md` and `templates/issue/feature-request.md`
24. Write `templates/kb-document/knowledge-doc.md`

### Phase 6 — Remaining skill depths
25. Deepen `nestjs-pro`, `postgresql-pro`, `docker-pro`, `ci-cd-pro`, `ai-integration-pro`
26. Add `references/decision-tree.md` to all core-tier skills
27. Add `references/integration-map.md` to all core-tier skills
28. Add `references/anti-patterns.md` to all core-tier and mid-tier skills

### Phase 7 — Self-Optimization & Contributor Loop (New)
29. **Token Tracking**: Standardize token reporting in all workflow outputs (Idea 2).
30. **Contributor Workflow**: Add logic to `self-improve-agent-pro` to automatically create PRs to the skills repo when new knowledge is discovered (Idea 1).
31. **Prompt Optimization**: Implement a feedback loop where high token usage triggers a prompt/skill review to reduce costs.
32. **Edge Case Harvesting**: Create a mechanism to "harvest" fixed bugs from external repos and add them as edge cases in `SKILL.md` files.

---

## Success Criteria

A skill, workflow, prompt, or template is "done" when an agent using it:

1. **Chooses the right approach** without asking a clarifying question for the 80% case
2. **Produces output** that follows `OUTPUT_CONVENTIONS.md` — severity emojis, callout blocks, before/after comparisons
3. **Hands off cleanly** — names the next skill/workflow/prompt to invoke after it completes
4. **Reports risks explicitly** — every output has a "residual risks" or callout block section
5. **Is verifiable** — the checklist at the end of each skill/workflow has items an agent can check autonomously

---

*Plan version 1.1 — 2026-04-02. Adds Implementation status + skills index convention. Owned by: repo maintainer.*
