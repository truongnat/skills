# /w-code-review — Run the code review workflow

You are executing the **code-review** workflow (**file** [`workflows/dev/w-code-review.md`](../../workflows/dev/w-code-review.md)).

## User input

$ARGUMENTS

## Instructions

1. **Read** [`workflows/dev/w-code-review.md`](../../workflows/dev/w-code-review.md) in full (Metadata, Inputs, Outputs, Steps, Notes).
2. **Resolve inputs:** `review_target` — PR URL, branch, diff, or file list (ask if missing). Optional: `domain_stack`, `review_focus` from `$ARGUMENTS` or open project context.
3. **Execute Steps 1–7 in order.** For each step, apply the listed **Skill** by reading that skill's **`skills/<name>/SKILL.md`** (bundled catalog: [`skills/README.md`](../../skills/README.md)).
4. **Report** using the workflow's output variables: `review_report`, `action_items`, `risk_summary`.

## Rules

- Always produce **Blocker / Important / Minor / Praise** severity buckets.
- Include **location** (file + line), **issue**, and **recommendation** for each finding.
- Do not block on style preferences — only on correctness, security, and reliability issues.
- For PRs > 500 lines, state explicitly which files were reviewed and which were skipped.
