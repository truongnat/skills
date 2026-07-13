---
name: planning
description: Build an execution plan from DISCUSSION.md, requirements, or clear requests. Task breakdown, dependencies, acceptance criteria, DoD, verification, and rollback strategy.
---

# Planning

## Purpose

Turn a clear goal into a concrete execution plan with order, dependencies, acceptance criteria, verification, and rollback.

## XML Contract

```xml
<Contract>
  <Inputs>DISCUSSION.md, requirement notes, user request, codebase mapping, affected systems, constraints.</Inputs>
  <Outputs>PLAN.md with goal, scope, assumptions, non-goals, affected files, task breakdown, dependencies, acceptance criteria, verification, DoD, rollback, risks.</Outputs>
  <Artifacts>
    <File name="PLAN.md" required="true">
      <Schema>
        <field name="goal" type="string" required="true">One sentence.</field>
        <field name="scope" type="string" required="true">In scope summary.</field>
        <field name="non_goals" type="array" required="false">Explicitly excluded outcomes.</field>
        <field name="assumptions" type="array" required="true">Assumptions with risk and confirmation status.</field>
        <field name="affected_files" type="array" required="true">Files/systems to change with expected change and confidence.</field>
        <field name="tasks" type="array" required="true">Task ID, description, dependencies, acceptance criteria, verification method, files/scope.</field>
        <field name="execution_order" type="array" required="true">Ordered list of task IDs.</field>
        <field name="verification_strategy" type="string" required="true">Automated and manual verification commands/steps.</field>
        <field name="definition_of_done" type="array" required="true">Checklist of verifiable completion conditions.</field>
        <field name="rollback_strategy" type="string" required="true">How to undo changes per type (code/config/data).</field>
        <field name="risks" type="array" required="false">Risks with impact and mitigation.</field>
        <field name="handoff" type="string" required="true">Ready for execution? Blocking items? Review required?</field>
      </Schema>
    </File>
  </Artifacts>
  <Safety>Do NOT implement code during planning. Do NOT invent affected files without inspecting the codebase. Do NOT treat assumptions as confirmed requirements. Do NOT skip rollback for destructive changes.</Safety>
</Contract>
```

## Quality Standards

- [ ] Each task has an ID (T-001, T-002) and is independently verifiable.
- [ ] Each task has at least one acceptance criterion.
- [ ] Verification strategy specifies exact commands or manual steps.
- [ ] DoD is a checklist of falsifiable conditions.
- [ ] Rollback strategy exists and matches change scope.
- [ ] Affected files are listed with confidence (known / inferred / unknown).
- [ ] For database/config/infra changes: rollback includes down-migration or restore procedure.

## WRONG vs CORRECT

```markdown
// WRONG — vague task
Update the export feature.

// CORRECT — verifiable task
T-001: Add server-side permission check for export endpoint.
AC: A user without export permission receives 403 when calling POST /api/export.
Verify: curl the endpoint with an unauthorized token → expect 403.
```

```markdown
// WRONG — no rollback
Rollback: Not needed.

// CORRECT — specific rollback
Rollback (code): revert the commit or disable the feature flag.
Rollback (config): restore previous env value from documented backup.
Rollback (data): run down-migration script, then restore data from pre-migration backup.
```

## Edge Cases

| Situation | Handling |
|---|---|
| Affected files unknown | Mark as "unknown" — do NOT invent. Add an investigate task to discover them. |
| Assumptions block execution | Mark blocking=Yes in assumptions table. Require confirmation before execution. |
| Task has no verification command available | Note "command unknown" and recommend finding it during sync. |
| Single-file change | Use Lite Mode. Do NOT force a full PLAN.md. |
| Destructive change (migration, delete, rename) | Require user review of rollback strategy before execution. |

## Limitations

- Does NOT implement code.
- Does NOT replace brainstorming when direction is unclear.
- Does NOT replace investigate when codebase mapping is missing.
- Does NOT auto-confirm assumptions.
