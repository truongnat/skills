# Workflow: implement-git-workflow

Align **branch**, **commit**, and **PR** practice with skill **`git-operations-pro`**; use **`code-packaging-pro`** only when the task is **CI YAML** or **hook** config, not merge strategy.

## Metadata

| Field | Value |
|-------|-------|
| **id** | `implement-git-workflow` |
| **version** | 1.0 |

## Inputs

| Variable | Required | Description |
|----------|----------|-------------|
| `scenario` | Yes | e.g. “conventional commits”, “resolve conflicts”, “PR template” |
| `policy` | No | Squash vs merge, protected branches |

## Outputs

| Variable | Description |
|----------|-------------|
| `recommendation` | Commands and team norms |
| `risks` | History rewrite, secrets |

## Steps

### Step 1 — `commits-and-branches`

- **Type:** skill
- **Skill:** `git-operations-pro`
- **Input:** `scenario`, `policy`
- **Output:** `recommendation` — [references/commits-and-branching.md](../../skills/git-operations-pro/references/commits-and-branching.md)

### Step 2 — `collaboration`

- **Type:** skill
- **Skill:** `git-operations-pro`
- **Input:** `scenario`
- **Output:** PR / review notes — [references/collaboration-and-safety.md](../../skills/git-operations-pro/references/collaboration-and-safety.md)

### Step 3 — `safety`

- **Type:** skill
- **Skill:** `git-operations-pro` (+ **`security-pro`** if secrets suspected)
- **Input:** draft plan
- **Output:** `risks` — [references/edge-cases.md](../../skills/git-operations-pro/references/edge-cases.md)
