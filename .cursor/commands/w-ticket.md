# /w-ticket — Run the ticket / Kanban workflow

You are executing the **ticket** workflow (**file** [`workflows/dev/w-ticket.md`](../../workflows/dev/w-ticket.md)).

## User input

$ARGUMENTS

## Instructions

1. **Read** [`workflows/dev/w-ticket.md`](../../workflows/dev/w-ticket.md) in full (Metadata, Inputs, Outputs, Steps, Notes).
2. **Resolve inputs:** ticket id (ask if missing). Optional: `domain_stack`, `issue_spec` from `$ARGUMENTS` or the open project context.
3. **Execute Steps 1–7 in order.** For each step, apply the listed **Skill** by reading that skill’s `skills/<name>/SKILL.md` (or **`ex/ticket/SKILL.md`** for ticket conventions). Do not skip conditional steps without explicit user confirmation (e.g. Step 2 only when a new bundled skill is truly needed per `SKILL_AUTHORING_RULES.md` §1).
4. **Report** using the workflow’s output variables where helpful: `kanban_tree`, `implementation`, `closing_reports`, `bundle_state`.

## Rules

- Primary contract for ticket phases and paths: [`ex/ticket/SKILL.md`](../../ex/ticket/SKILL.md).
- After adding any new `skills/<name>/`, follow **`skills/SKILL_AUTHORING_RULES.md` §8** and run **`python scripts/validate_skills.py`** (and **`build_skill_index.py`** as listed in the workflow).
