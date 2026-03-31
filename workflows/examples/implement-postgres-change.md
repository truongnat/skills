# Workflow: implement-postgres-change

Thiết kế hoặc chỉnh sửa PostgreSQL (schema, index, migration, query) từ spec đến review rủi ro vận hành, tham chiếu skill **`postgresql-pro`**.

## Metadata

| Thuộc tính | Giá trị |
|------------|---------|
| **id** | `implement-postgres-change` |
| **version** | 1.0 |

## Đầu vào

| Biến | Bắt buộc | Mô tả |
|------|----------|--------|
| `change_spec` | Có | Bảng/cột/index, ràng buộc, RLS/policies (nếu có), volume ước lượng, cửa sổ bảo trì (nếu có) |
| `pg_version` | Không | Major PostgreSQL nếu biết (ảnh hưởng cú pháp / planner) |

## Đầu ra

| Biến | Mô tả |
|------|--------|
| `migration_plan` | Thứ tự bước SQL/migration + rollback gợi ý |
| `review_notes` | Lock, backfill, vacuum, replica |

## Các bước

### Bước 1 — `spec-to-plan`

- **Loại:** skill
- **Skill:** `postgresql-pro`
- **Đầu vào:** Chuẩn hóa `change_spec`: additive vs breaking, FK, index `CONCURRENTLY`, quyền role, RLS (`ENABLE ROW LEVEL SECURITY`, policy `USING`/`WITH CHECK`, tenant context).
- **Đầu ra:** `migration_plan` (thứ tự an toàn)

### Bước 2 — `implement-sql`

- **Loại:** skill
- **Skill:** `postgresql-pro`
- **Đầu vào:** `migration_plan` + `change_spec`
- **Đầu ra:** SQL / file migration — theo [references/schema-and-query-design.md](../../skills/public/postgresql-pro/references/schema-and-query-design.md) và [references/tips-and-tricks.md](../../skills/public/postgresql-pro/references/tips-and-tricks.md)

### Bước 3 — `ops-and-edge-review`

- **Loại:** skill
- **Skill:** `postgresql-pro`
- **Đầu vào:** SQL đã soạn
- **Đầu ra:** `review_notes` — đối chiếu [references/edge-cases.md](../../skills/public/postgresql-pro/references/edge-cases.md), [references/row-level-security.md](../../skills/public/postgresql-pro/references/row-level-security.md) (nếu bật RLS), và checklist trong `SKILL.md`
