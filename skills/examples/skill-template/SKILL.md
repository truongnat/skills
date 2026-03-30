---
name: skill-template
description: |
  Mẫu skill để nhân bản. Thay name/description bằng giá trị cụ thể.
  Mô tả phải nêu rõ KHI NÀO skill được dùng (từ khóa, ngữ cảnh, ví dụ câu hỏi).
metadata:
  short-description: Template skill — copy và đổi tên
---

# Tên skill (đổi theo skill của bạn)

## Khi nào dùng

- Tình huống 1: …
- Tình huống 2: …
- Từ khóa gợi ý: `…`, `…`

## Cách làm (workflow)

1. Thu thập input / xác nhận mục tiêu
2. …
3. Trả output theo định dạng đã chọn

## Tài nguyên trong skill (tùy chọn)

- `references/` — tài liệu dài, chỉ đọc khi cần (API, policy, schema)
- `scripts/` — lệnh chạy xác định (Python/bash)
- `assets/` — file đính kèm output (template HTML, logo, …)

## Ví dụ nhanh

**Input:** …  
**Output mong đợi:** …

## Checklist trước khi coi skill là xong

- [ ] `description` trong frontmatter đủ cụ thể để agent biết khi nào trigger
- [ ] Không nhồi toàn bộ tài liệu tham khảo vào đây — chuyển sang `references/`
- [ ] Đã thử với 1–2 prompt thật
