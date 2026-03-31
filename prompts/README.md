# Prompts

Put reusable **Markdown** (`.md`) prompt files here, for example:

- `templates/` — one file per “template” with System / User sections and `{{variable_name}}` placeholders
- `chains/` — (optional) multi-step chains described in Markdown, similar to [workflows/](../workflows/)

Example library and format notes: [templates/PROMPT_TEMPLATES.md](../templates/PROMPT_TEMPLATES.md) (described in Markdown; no required `.yaml`/`.yml`).

## Example prompt (minimal)

File đầy đủ: [templates/example-skill-assisted-task.md](templates/example-skill-assisted-task.md). Bản rút gọn:

```markdown
## System prompt

Bạn là kỹ sư senior. Chỉ định skill `skills/*-pro/` phù hợp và lý do; tách bước kiểm chứng được.

## User prompt (template)

**Mục tiêu:** {{feature_goal}}
**Stack:** {{stack}}
**Ràng buộc:** {{constraints}}

Đưa (1) phạm vi MVP, (2) checklist rủi ro, (3) skill cần kết hợp.
```

Thay `{{feature_goal}}`, `{{stack}}`, `{{constraints}}` bằng nội dung thật (hoặc để agent điền) trước khi gửi model.
