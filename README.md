# SKILLS — Skills, workflows & knowledge base (Markdown)

Template repo for **skills** (per `SKILL.md` convention), **workflows** (Markdown step files), and a **knowledge base** (`.md` files + minimal local RAG). **Configuration and workflows do not use `.yaml`/`.yml`** — Markdown only (plus JSON emitted by scripts for the vector manifest).

## Contents

- [Directory layout](#directory-layout)
- [Quick start](#quick-start)
- [Knowledge base & RAG](#knowledge-base--rag)
- [Skills](#skills)
- [Workflows](#workflows)
- [Prompt templates](#prompt-templates)
- [Cursor / Agent](#cursor--agent)
- [More docs under `templates/`](#more-docs-under-templates)

## Directory layout

```
own-skills/
├── config.example.md          # Sample config (kb-config block for scripts)
├── requirements.txt           # Python: numpy, sentence-transformers
├── skills/
│   ├── README.md
│   ├── examples/skill-template/SKILL.md
│   ├── <skill-name>/           # e.g. react-pro, nextjs-pro, …
│   └── …
├── workflows/
│   ├── README.md              # Workflow convention (.md)
│   └── examples/*.md
├── knowledge-base/
│   ├── INDEX.md
│   ├── documents/             # Source-of-truth (.md)
│   └── embeddings/          # rag_*.npy / .json (generated, gitignored)
├── prompts/
│   └── README.md
├── scripts/
│   ├── kb_config_md.py        # Read config from Markdown
│   ├── build_kb.py
│   └── query_kb.py
└── templates/                 # Extra docs & samples (see below)
```

## Quick start

```bash
cd own-skills
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Config (optional): copy and edit the <!-- kb-config --> block
cp config.example.md config.md
nano config.md

# Knowledge base — dry-run, build, query
python scripts/build_kb.py --dry-run
python scripts/build_kb.py
python scripts/query_kb.py "text to search" -k 5
```

**Python:** 3.10–3.13 recommended. First build downloads an embedding model (network, RAM).

## Knowledge base & RAG

1. Add or edit `.md` files under [`knowledge-base/documents/`](knowledge-base/documents/).
2. Update [`knowledge-base/INDEX.md`](knowledge-base/INDEX.md) for quick lookup.
3. Run `scripts/build_kb.py` to produce `rag_embeddings.npy` + `rag_manifest.json` in `knowledge-base/embeddings/` (gitignored).
4. `scripts/query_kb.py` runs cosine similarity locally (NumPy); no Chroma/PyYAML required.

Paths and model live in the `<!-- kb-config-start -->` … `<!-- kb-config-end -->` block in [`config.example.md`](config.example.md) or `config.md`.

## Skills

- Copy [`skills/examples/skill-template/`](skills/examples/skill-template/) → `skills/<skill-name>/`.
- Edit `SKILL.md`: frontmatter `name` and `description` (state clearly when it triggers).
- Layout and bundled examples: [`skills/README.md`](skills/README.md).
- Bundled examples: [`skills/react-pro/`](skills/react-pro/) (React web), [`skills/nextjs-pro/`](skills/nextjs-pro/) (Next.js), [`skills/react-native-pro/`](skills/react-native-pro/) (React Native / Expo), [`skills/flutter-pro/`](skills/flutter-pro/) (Flutter), [`skills/nestjs-pro/`](skills/nestjs-pro/) (NestJS), [`skills/postgresql-pro/`](skills/postgresql-pro/) (PostgreSQL).

## Workflows

- Convention: [`workflows/README.md`](workflows/README.md).
- Examples: [`workflows/examples/research-synthesize.md`](workflows/examples/research-synthesize.md), [`workflows/examples/implement-react-feature.md`](workflows/examples/implement-react-feature.md) (React + `react-pro`), [`workflows/examples/implement-nextjs-feature.md`](workflows/examples/implement-nextjs-feature.md) (Next.js + `nextjs-pro`), [`workflows/examples/implement-rn-screen.md`](workflows/examples/implement-rn-screen.md) (RN + `react-native-pro`), [`workflows/examples/implement-flutter-screen.md`](workflows/examples/implement-flutter-screen.md) (Flutter + `flutter-pro`), [`workflows/examples/implement-nest-feature.md`](workflows/examples/implement-nest-feature.md) (NestJS + `nestjs-pro`), [`workflows/examples/implement-postgres-change.md`](workflows/examples/implement-postgres-change.md) (Postgres + `postgresql-pro`).
- A workflow is a **Markdown contract** for humans/agents to follow sequentially; an automated runner is optional.

## Prompt templates

- Where to put files: [`prompts/README.md`](prompts/README.md).
- Example library: [`templates/PROMPT_TEMPLATES.md`](templates/PROMPT_TEMPLATES.md) (format described in Markdown).

## Cursor / Agent

- See [`AGENTS.md`](AGENTS.md): how to use skills with Cursor (copy/symlink into Cursor’s skills folder).

## More docs under `templates/`

- [`templates/START_HERE.md`](templates/START_HERE.md), [`templates/SKILL_SYSTEM_GUIDE.md`](templates/SKILL_SYSTEM_GUIDE.md), [`templates/config.template.md`](templates/config.template.md) — some sections are historical; **this repo’s source of truth** is this README and `config.example.md`.

## License

MIT (add a `LICENSE` file if you publish the repo).
