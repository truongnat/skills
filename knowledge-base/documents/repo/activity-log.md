| Field | Value |
|-------|-------|
| title | Activity and decisions log |
| summary | Dated entries: user/agent decisions, audits, follow-ups for this skills template repo |
| tags | repo, activity, decisions |
| updated | 2026-03-31 |

# Nhat ky hoat dong / quyet dinh

**Muc dich:** Ghi lai **ngan** cac viec quan trong (khong thay the git log). Agent hoac nguoi bao tri them muc moi theo ngay khi co quyet dinh ro.

**Quy tac:** Xem [documentation-persistence.md](../policies/documentation-persistence.md) va Cursor rule **`.cursor/rules/documentation-persistence.mdc`**.

---

### 2026-03-31

- **Nguồn:** agent + user request
- **Việc:** Thêm rule **documentation-persistence**, policy + activity log; mở rộng **skills-self-review-pro** (tech refresh + **web-research-pro**).
- **Follow-up:** Chạy `build_kb` sau khi corpus KB đổi; định kỳ dùng self-review + tra cứu docs chính thức cho stack.
- **Việc:** Tạo skill mới **`market-research-pro`** (SKILL + references) và cập nhật README/AGENTS/skills-layout theo quy tắc §8.
- **Việc:** Tạo skill mới **`strategic-consulting-pro`** (SKILL + references) và cập nhật README/AGENTS/skills-layout/SKILL_AUTHORING_RULES theo quy tắc §8.

### YYYY-MM-DD (mẫu)

- **Nguồn:** (user / agent / CI)
- **Việc:** (ví dụ: chạy `analyze_skills.py --self-review`, thêm skill X)
- **Kết luận / follow-up:** (…)
