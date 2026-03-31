| Field | Value |
|-------|-------|
| title | External deep review → this repo |
| summary | Maps a third-party “Skills Repo” audit (docx/pptx/xlsx, pdf/pdf-reading, …) to `*-pro` template; avoids duplicate work and wrong expectations |
| tags | repo, skills, planning |
| updated | 2026-03-31 |

# Ánh xạ review bên ngoài → repo template này

Một số bản **Deep Review** mô tả bộ skill kiểu Anthropic/master (16× `SKILL.md`, `scripts/office/` trùng lặp, `pdf` vs `pdf-reading`, `file-reading`, `skill-creator`, `frontend-design`, …). **Repo `skills` template này** dùng cây **`skills/*-pro/`** (stack + phân tích + tooling) — **không** chứa `docx`/`pptx`/`xlsx` độc lập, **không** có `scripts/office/`, **không** có skill `pdf-reading` tách biệt.

Khi “áp review”, hãy dịch **ý định** sang skill tương đương bên dưới — **đừng** tìm thư mục không tồn tại.

## Đã có trong repo (tương đương ưu tiên review)

| Ý trong review | Thực tế repo này |
|----------------|------------------|
| `data-analysis` skill | [`data-analysis-pro`](../../../skills/data-analysis-pro/) — EDA, pandas, viz, Parquet/SQLite, openpyxl chart / pivot / freeze / validation |
| `image-manipulation` | [`image-processing-pro`](../../../skills/image-processing-pro/) — Pillow |
| `web-research` + 404 docs | [`web-research-pro`](../../../skills/web-research-pro/) — nguồn, trích dẫn, URL stale |
| `code-packaging` / Docker / GHA | [`code-packaging-pro`](../../../skills/code-packaging-pro/) — tách với [`deployment-pro`](../../../skills/deployment-pro/) |
| `frontend-design` a11y / responsive / font | [`design-system-pro`](../../../skills/design-system-pro/) → `references/a11y-responsive-and-web-typography.md`; native mobile → [`mobile-design-pro`](../../../skills/mobile-design-pro/) |
| SQLite / Parquet / dispatch file | [`content-analysis-pro`](../../../skills/content-analysis-pro/) → `references/file-formats-dispatch-and-scope.md` (đã mở rộng `.ipynb`, YAML/TOML, OCR/Tesseract); skill riêng cho **SQL file** → [`sql-data-access-pro`](../../../skills/sql-data-access-pro/) |
| `database` / `sql` (query `.db`) | [`sql-data-access-pro`](../../../skills/sql-data-access-pro/) — handoff Postgres → [`postgresql-pro`](../../../skills/postgresql-pro/) |
| `git-operations` | [`git-operations-pro`](../../../skills/git-operations-pro/) |
| `frontend-design` performance (lazy load, CLS) | [`design-system-pro`](../../../skills/design-system-pro/) → `references/web-performance-basics.md` |
| Tránh trùng “đọc PDF” vs “tạo PDF” | Một skill phân tích nội dung + bảng phân luồng (không tách hai skill `pdf`) |

## Không áp dụng trực tiếp (không có artifact tương ứng)

| Mục review | Ghi chú |
|------------|---------|
| Gộp `scripts/office/` 3 lần | Không có `scripts/office/` trong repo |
| Merge `pdf` + `pdf-reading` | Không có hai skill đó |
| Gaps `docx` / `pptx` / `xlsx` / `pptxgenjs` / `brand-guidelines` / `canvas-design` / … | Thuộc **bộ skill khác**; muốn tương đương: fork thêm skill domain hoặc tham chiếu upstream |
| `skill-creator` / `mcp-builder` overlap | Không bundle trong `skills/` — xem skill cài qua IDE (Codex/Cursor) nếu cần |

## Việc còn lại (tùy chọn)

- Skill domain **docx/pptx/xlsx** như bộ Anthropic — **không** nằm trong template; fork hoặc thêm gói riêng nếu cần.
- Runbook Postgres bổ sung — tùy team; **`sql-data-access-pro`** đã tách SQLite khỏi **`postgresql-pro`**.

## Nguồn

Bản review gốc là tài liệu độc lập (truongnat/skills hoặc bộ skill public khác); file này chỉ **định vị** nó so với repo template hiện tại.
