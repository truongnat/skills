# Workflow: implement-nest-feature

Triển khai một feature NestJS (module/controller/service/DTO) từ spec đến review (API/DX + edge cases), tham chiếu skill **`nestjs-pro`**.

## Metadata

| Thuộc tính | Giá trị |
|------------|---------|
| **id** | `implement-nest-feature` |
| **version** | 1.0 |

## Đầu vào

| Biến | Bắt buộc | Mô tả |
|------|----------|--------|
| `feature_spec` | Có | Endpoint, domain rules, auth, persistence, PostgreSQL RLS / tenant context (nếu có) (Markdown hoặc bullet) |
| `stack` | Không | Nest major, ORM (Prisma/TypeORM/…), transport nếu có |

## Đầu ra

| Biến | Mô tả |
|------|--------|
| `implementation` | Module + code gợi ý + checklist |
| `review_notes` | Rủi ro (migration, security, scale) |

## Các bước

### Bước 1 — `spec-to-plan`

- **Loại:** skill
- **Skill:** `nestjs-pro`
- **Đầu vào:** Chuẩn hóa `feature_spec`: module boundaries, DTOs, guards, lỗi HTTP, transaction boundaries, RLS (`SET LOCAL` / pool + ORM).
- **Đầu ra:** `plan` (file tạo/sửa, providers, tokens)

### Bước 2 — `implement`

- **Loại:** skill
- **Skill:** `nestjs-pro`
- **Đầu vào:** `plan` + `feature_spec`
- **Đầu ra:** `code` — theo [references/api-design-and-dx.md](../../skills/public/nestjs-pro/references/api-design-and-dx.md), [references/tips-and-tricks.md](../../skills/public/nestjs-pro/references/tips-and-tricks.md), và [references/postgresql-rls-integration.md](../../skills/public/nestjs-pro/references/postgresql-rls-integration.md) khi dùng RLS

### Bước 3 — `edge-and-security-review`

- **Loại:** skill
- **Skill:** `nestjs-pro`
- **Đầu vào:** `code`
- **Đầu ra:** `review_notes` — đối chiếu [references/edge-cases.md](../../skills/public/nestjs-pro/references/edge-cases.md), [references/postgresql-rls-integration.md](../../skills/public/nestjs-pro/references/postgresql-rls-integration.md) và skill **`postgresql-pro`** ([row-level-security.md](../../skills/public/postgresql-pro/references/row-level-security.md)) khi có RLS; checklist trong `SKILL.md`
