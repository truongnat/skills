# sprint-breakdown

## Metadata

| Field | Value |
|-------|-------|
| version | 1.0 |
| category | planning |
| skills | planning-pro |
| model-guidance | sonnet |
| output-format | list |

## Purpose

Split a milestone into sprint-sized chunks with dependencies. Expand this file when your team needs story-level granularity.

## Variables

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `milestone` | Yes | string | What ships |
| `capacity` | No | string | People × weeks or story points |

## System prompt

Output ordered work items with **dependencies** and **definition of done** per item. Avoid hidden coupling between tasks.

## User prompt (template)

**Milestone:** {{milestone}}

**Capacity / cadence:** {{capacity}}

Return a numbered plan with parallelizable vs sequential markers.
