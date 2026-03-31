"""
Read knowledge-base settings from Markdown: the block between
<!-- kb-config-start --> and <!-- kb-config-end --> with key = value lines.
"""
from __future__ import annotations

import re
from pathlib import Path


def parse_kb_config_block(text: str) -> dict[str, str]:
    m = re.search(
        r"<!--\s*kb-config-start\s*-->(.*?)<!--\s*kb-config-end\s*-->",
        text,
        re.DOTALL | re.IGNORECASE,
    )
    if not m:
        return {}
    out: dict[str, str] = {}
    for line in m.group(1).splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        k, v = line.split("=", 1)
        out[k.strip()] = v.strip().strip('"').strip("'")
    return out


def load_kb_config(root: Path) -> dict[str, str]:
    for name in ("config.md", "config.example.md"):
        p = root / name
        if p.is_file():
            return parse_kb_config_block(p.read_text(encoding="utf-8"))
    return {}


def kb_paths_from_config(cfg: dict[str, str]) -> tuple[str, str, str, str, int, int]:
    """documents_path, model, embeddings_path, manifest_path, chunk_size, chunk_overlap."""
    doc = cfg.get("documents_path") or "knowledge-base/documents"
    model = cfg.get("embedding_model") or "sentence-transformers/all-MiniLM-L6-v2"
    emb = cfg.get("embeddings_path") or "knowledge-base/embeddings/rag_embeddings.npy"
    man = cfg.get("manifest_path") or "knowledge-base/embeddings/rag_manifest.json"
    size = int(cfg.get("chunk_size") or 1000)
    overlap = int(cfg.get("chunk_overlap") or 200)
    return doc, model, emb, man, size, overlap
