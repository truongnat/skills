# Step 01 — Init (seed DISCUSSION template)

## Goal

Create session `DISCUSSION.md` from the skill template **before** filling content.

## Rules

- Read this step fully. Do **not** skip to recommendation yet.
- Do **not** invent DISCUSSION free-form — copy the template.
- Do **not** create PLAN.md / TASKS.md / design docs in this skill.
- Do **not** proceed to step-02 until `DISCUSSION.md` exists on disk.

## Actions

1. Resolve session dir: `.agents/sessions/<Task-N-short-description>/` (create if missing).
2. Locate template: `{skill-root}/templates/DISCUSSION.template.md`
3. Copy (Write tool) → `{session}/DISCUSSION.md`
4. If `DISCUSSION.md` already exists with real content:
   - Ask user: overwrite with fresh template, or keep and continue from step-02.
   - Default if user says redo brainstorming: overwrite with template.
5. List the session directory and confirm `DISCUSSION.md` exists.

## Done when

- [ ] `DISCUSSION.md` exists in session (from template).
- [ ] Confirmed via directory listing.

## Next

Only after Done: Read and follow `./step-02-frame.md`.
