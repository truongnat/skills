#!/usr/bin/env python3
"""
Verify knowledge-base tooling: config, documents, optional index consistency, smoke retrieval.

Exit code 0 = all checks passed. Non-zero = failure (see stderr).

This does NOT prove "semantic quality" is perfect-only that the pipeline is consistent.
For stronger guarantees, add golden queries (expected source file) below or in CI.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))
from kb_config_md import kb_paths_from_config, load_kb_config


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def iter_markdown_files(doc_root: Path) -> list[Path]:
    if not doc_root.is_dir():
        return []
    return sorted(doc_root.rglob("*.md"))


def main() -> int:
    root = repo_root()
    cfg = load_kb_config(root)
    if not cfg:
        print("FAIL: No kb-config block in config.md or config.example.md", file=sys.stderr)
        return 1

    doc_rel, model_name, emb_rel, man_rel, chunk_size, overlap = kb_paths_from_config(cfg)
    doc_root = (root / doc_rel).resolve()
    emb_path = (root / emb_rel).resolve()
    man_path = (root / man_rel).resolve()

    print(f"OK: config loaded (model={model_name}, chunk_size={chunk_size}, overlap={overlap})")
    print(f"    documents_path -> {doc_rel}")

    files = iter_markdown_files(doc_root)
    if not files:
        print(f"FAIL: No .md files under {doc_root}", file=sys.stderr)
        return 1
    print(f"OK: found {len(files)} markdown file(s) under documents/")

    if not emb_path.is_file() or not man_path.is_file():
        print("WARN: index not built yet (run: python scripts/build_kb.py)")
        print("      Skipping embedding/manifest checks.")
        return 0

    E = np.load(str(emb_path))
    with man_path.open(encoding="utf-8") as f:
        manifest = json.load(f)

    if not isinstance(manifest, list) or len(manifest) == 0:
        print("FAIL: manifest is empty or invalid JSON list", file=sys.stderr)
        return 1

    n = len(manifest)
    if E.shape[0] != n:
        print(
            f"FAIL: embeddings rows ({E.shape[0]}) != manifest entries ({n}). Rebuild.",
            file=sys.stderr,
        )
        return 1
    print(f"OK: index rows ({n}) match manifest length")

    dim = E.shape[1] if E.ndim == 2 else 0
    if dim <= 0:
        print("FAIL: invalid embedding matrix shape", file=sys.stderr)
        return 1
    print(f"OK: embedding matrix shape {E.shape} (dtype={E.dtype})")

    # Smoke: each manifest row has required keys and non-empty id
    for i, row in enumerate(manifest):
        if not row.get("id"):
            print(f"FAIL: manifest[{i}] missing id", file=sys.stderr)
            return 1
    print("OK: manifest entries have ids")

    # Optional: quick retrieval smoke (requires sentence_transformers)
    try:
        from sentence_transformers import SentenceTransformer
    except ImportError:
        print("WARN: sentence_transformers not installed; skip retrieval smoke test")
        return 0

    model = SentenceTransformer(model_name)
    q = model.encode(["skills directory layout"], convert_to_numpy=True)[0].astype(np.float32)
    q = q / (np.linalg.norm(q) + 1e-12)
    En = E / (np.linalg.norm(E, axis=1, keepdims=True) + 1e-12)
    scores = En @ q
    best = int(np.argmax(scores))
    top_source = manifest[best].get("source", "")
    if "skills-layout.md" in top_source:
        print(f"OK: smoke query ranks expected doc first (source={top_source})")
    else:
        print(
            f"WARN: smoke query top source is {top_source!r} (expected chunk from skills-layout.md). "
            "This can happen if corpus/embeddings changed; not a hard failure.",
        )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
