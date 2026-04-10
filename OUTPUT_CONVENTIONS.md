# Output conventions — agent & human reports

Use this **visual contract** for workflow outputs, skill responses, audits, and reviews so severity and structure stay consistent across the repo.

## Severity emoji system

| Level | Emoji | Use for |
|-------|-------|---------|
| Critical / blocker | 🔴 | Must fix before merge; security critical; data-loss risk |
| High / important | 🟡 | Should fix; important warnings |
| Medium | 🟠 | Notable findings; consider addressing |
| Low / minor | 🟢 | Optional improvements; style |
| Info / praise | ✅ | Good patterns; passing checks |
| In progress | 🔵 | Active work; pending |
| Skipped / N/A | ⚪ | Out of scope; not reviewed |

## Callout blocks (GFM alerts)

```markdown
> [!NOTE]
> Informational context.

> [!TIP]
> Non-obvious best practice.

> [!WARNING]
> Risk or gotcha.

> [!CAUTION]
> Data loss, security breach, or outage risk.
```

## Report header (standard)

```markdown
# {{Report type}} — {{subject}}

> **Date:** {{ISO date}}  **Author:** {{name}}  **Version:** 1.0  
> **Status:** Draft | Final | Superseded
```

## Code blocks

- Always specify a **language** on fenced blocks (` ```typescript `, ` ```bash `).

## Before / after (recommendations)

```markdown
**Before** (current):

```ts
// problematic code
```

**After** (recommended):

```ts
// fixed code
```
```

## Progress tables

| Step | Status | Notes |
|------|--------|-------|
| Reproduce | ✅ Done | … |
| Root cause | 🔵 In progress | — |

## Token Usage Reporting

Every significant action and workflow completion MUST include a token usage summary at the very end of the response. This ensures transparency and provides data for self-optimization.

### Action Summary (Short)
Use at the end of individual tool calls or mid-workflow responses.
`[Tokens: I:{{input}} | O:{{output}} | T:{{total}}]`

### Workflow Summary (Detailed)
Use at the end of a completed workflow (e.g., `/w-ticket`, `/w-hotfix`).

| Metric | Count | Note |
|--------|-------|------|
| Input Tokens | {{count}} | |
| Output Tokens | {{count}} | |
| **Total Tokens** | **{{total}}** | |
| Total Actions | {{count}} | Number of model interactions |

> [!TIP]
> If total tokens for a workflow exceed 50k, consider triggering `self-improve-agent-pro` to optimize prompting for this task.

## Related templates

- Code review report: [`templates/report/code-review.md`](templates/report/code-review.md)
- Security audit: [`templates/report/security-audit.md`](templates/report/security-audit.md)
- Performance investigation: [`templates/report/performance-report.md`](templates/report/performance-report.md)
- Incident: [`templates/report/incident-report.md`](templates/report/incident-report.md)
- Test strategy: [`templates/report/test-strategy.md`](templates/report/test-strategy.md)
- Dependency audit: [`templates/report/dependency-audit.md`](templates/report/dependency-audit.md)
- Debug / RCA: [`templates/report/debug-report.md`](templates/report/debug-report.md)
- Project index (`/w-index-project`): [`templates/report/project-index-report.md`](templates/report/project-index-report.md)
- ADR: [`templates/report/architecture-decision-record.md`](templates/report/architecture-decision-record.md)
