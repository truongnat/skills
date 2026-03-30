#!/usr/bin/env python3
"""
Đọc Markdown trong knowledge-base/documents/, chunk, embed bằng sentence-transformers,
lưu vector + manifest JSON tại knowledge-base/embeddings/ (gitignored).
Cấu hình đọc từ config.md / config.example.md (khối <!-- kb-config --> trong Markdown).
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
from sentence_transformers import SentenceTransformer

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))
from kb_config_md import kb_paths_from_config, load_kb_config


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def strip_frontmatter(text: str) -> str:
    if not text.startswith("---"):
        return text
    parts = text.split("---", 2)
    if len(parts) >= 3:
        return parts[2].lstrip("\n")
    return text


def chunk_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    if chunk_size <= 0:
        return [text]
    chunks: list[str] = []
    start = 0
    n = len(text)
    while start < n:
        end = min(start + chunk_size, n)
        chunks.append(text[start:end])
        if end >= n:
            break
        start = max(0, end - overlap)
    return chunks


def iter_markdown_files(doc_root: Path) -> list[Path]:
    if not doc_root.is_dir():
        return []
    return sorted(doc_root.rglob("*.md"))


def main() -> int:
    parser = argparse.ArgumentParser(description="Build local RAG index from knowledge-base documents.")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="List files and chunk counts without writing index",
    )
    args = parser.parse_args()

    root = repo_root()
    cfg = load_kb_config(root)
    doc_rel, model_name, emb_rel, man_rel, chunk_size, overlap = kb_paths_from_config(cfg)
    doc_root = (root / doc_rel).resolve()
    emb_path = (root / emb_rel).resolve()
    man_path = (root / man_rel).resolve()
    emb_path.parent.mkdir(parents=True, exist_ok=True)

    files = iter_markdown_files(doc_root)
    if not files:
        print(f"No .md files under {doc_root}", file=sys.stderr)
        return 1

    manifest: list[dict] = []
    texts: list[str] = []

    for path in files:
        rel = path.relative_to(root)
        raw = path.read_text(encoding="utf-8")
        body = strip_frontmatter(raw)
        chunks = chunk_text(body, chunk_size, overlap)
        for i, ch in enumerate(chunks):
            cid = f"{rel.as_posix()}:{i}"
            texts.append(ch)
            manifest.append(
                {
                    "id": cid,
                    "source": rel.as_posix(),
                    "chunk": i,
                    "text": ch,
                }
            )

    if args.dry_run:
        print(f"Model: {model_name}")
        print(f"Embeddings: {emb_path}")
        print(f"Manifest: {man_path}")
        print(f"Chunks: {len(texts)} from {len(files)} files")
        return 0

    print(f"Loading embedding model: {model_name} …")
    model = SentenceTransformer(model_name)
    print("Encoding …")
    embeddings = model.encode(texts, show_progress_bar=True, convert_to_numpy=True)
    embeddings = np.asarray(embeddings, dtype=np.float32)

    np.save(str(emb_path), embeddings)
    with man_path.open("w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=0)

    print(f"Saved {len(manifest)} chunks → {emb_path} + {man_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
