# own-skills — Skills, workflows & knowledge base (Markdown)

Repo template để tự tạo **skill** (theo quy ước `SKILL.md`), **workflow** (file Markdown mô tả bước), và **knowledge base** (tài liệu `.md` + RAG cục bộ tối thiểu). **Cấu hình và workflow không dùng file `.yaml`/`.yml`** — chỉ Markdown (và JSON do script sinh cho manifest vector).

## Mục lục

- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Quick start](#quick-start)
- [Knowledge base & RAG](#knowledge-base--rag)
- [Skills](#skills)
- [Workflows](#workflows)
- [Prompt templates](#prompt-templates)
- [Cursor / Agent](#cursor--agent)
- [Tài liệu thêm trong `templates/`](#tài-liệu-thêm-trong-templates)

## Cấu trúc thư mục

```
own-skills/
├── config.example.md          # Cấu hình mẫu (khối kb-config cho scripts)
├── requirements.txt           # Python: numpy, sentence-transformers
├── skills/
│   ├── examples/skill-template/SKILL.md
│   ├── public/
│   └── private/
├── workflows/
│   ├── README.md              # Quy ước workflow (.md)
│   └── examples/*.md
├── knowledge-base/
│   ├── INDEX.md
│   ├── documents/             # Nguồn sự thật (.md)
│   └── embeddings/            # rag_*.npy / .json (generated, gitignored)
├── prompts/
│   └── README.md
├── scripts/
│   ├── kb_config_md.py        # Đọc cấu hình từ Markdown
│   ├── build_kb.py
│   └── query_kb.py
└── templates/                 # Tài liệu & mẫu bổ sung (xem bên dưới)
```

## Quick start

```bash
cd own-skills
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Cấu hình (tùy chọn): sao chép và chỉnh khối <!-- kb-config -->
cp config.example.md config.md
nano config.md

# Knowledge base — dry-run, build, query
python scripts/build_kb.py --dry-run
python scripts/build_kb.py
python scripts/query_kb.py "nội dung cần tìm" -k 5
```

**Python:** khuyến nghị 3.10–3.13. Lần đầu chạy build sẽ tải model embedding (cần mạng, tốn RAM).

## Knowledge base & RAG

1. Thêm hoặc sửa file `.md` trong [`knowledge-base/documents/`](knowledge-base/documents/).
2. Cập nhật [`knowledge-base/INDEX.md`](knowledge-base/INDEX.md) để tra cứu nhanh.
3. Chạy `scripts/build_kb.py` để tạo `rag_embeddings.npy` + `rag_manifest.json` trong `knowledge-base/embeddings/` (đã gitignore).
4. `scripts/query_kb.py` truy vấn cosine trên vector cục bộ (NumPy), không cần Chroma/PyYAML.

Cấu hình đường dẫn và model nằm trong **khối** `<!-- kb-config-start -->` … `<!-- kb-config-end -->` của [`config.example.md`](config.example.md) hoặc `config.md`.

## Skills

- Sao chép [`skills/examples/skill-template/`](skills/examples/skill-template/) → `skills/public/<tên-skill>/`.
- Sửa `SKILL.md`: frontmatter `name` và `description` (mô tả rõ khi nào trigger).
- Skill công khai / riêng tư: xem [`skills/public/README.md`](skills/public/README.md) và [`skills/private/README.md`](skills/private/README.md).

## Workflows

- Quy ước: [`workflows/README.md`](workflows/README.md).
- Ví dụ: [`workflows/examples/research-synthesize.md`](workflows/examples/research-synthesize.md).
- Workflow là **hợp đồng Markdown** cho người/agent thực hiện tuần tự; không bắt buộc runner tự động.

## Prompt templates

- Hướng dẫn đặt file: [`prompts/README.md`](prompts/README.md).
- Thư viện ví dụ: [`templates/PROMPT_TEMPLATES.md`](templates/PROMPT_TEMPLATES.md) (định dạng mô tả bằng Markdown).

## Cursor / Agent

- File [`AGENTS.md`](AGENTS.md): gợi ý dùng skill với Cursor (copy/symlink vào thư mục skills của Cursor).

## Tài liệu thêm trong `templates/`

- [`templates/START_HERE.md`](templates/START_HERE.md), [`templates/SKILL_SYSTEM_GUIDE.md`](templates/SKILL_SYSTEM_GUIDE.md), [`templates/config.template.md`](templates/config.template.md) — một số đoạn mang tính lịch sử; **chuẩn repo** lấy từ README này và `config.example.md`.

## License

MIT (thêm file `LICENSE` nếu bạn công khai repo).
