#!/usr/bin/env python3
"""
Truy vấn index cục bộ (cùng model embedding với build_kb.py), in top-k đoạn + metadata.
Cấu hình đọc từ config.md / config.example.md (Markdown).
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


def main() -> int:
    parser = argparse.ArgumentParser(description="Query knowledge base (local embeddings + manifest).")
    parser.add_argument("query", help="Natural language question")
    parser.add_argument("-k", "--top-k", type=int, default=5, help="Number of chunks to return")
    args = parser.parse_args()

    root = repo_root()
    cfg = load_kb_config(root)
    _doc, model_name, emb_rel, man_rel, _cs, _ov = kb_paths_from_config(cfg)
    emb_path = (root / emb_rel).resolve()
    man_path = (root / man_rel).resolve()

    if not emb_path.is_file() or not man_path.is_file():
        print(
            f"Index not found. Expected:\n  {emb_path}\n  {man_path}\n"
            "Run: python scripts/build_kb.py",
            file=sys.stderr,
        )
        return 1

    E = np.load(str(emb_path))
    with man_path.open(encoding="utf-8") as f:
        manifest: list[dict] = json.load(f)

    if len(manifest) != E.shape[0]:
        print("Manifest length does not match embeddings rows; rebuild with build_kb.py", file=sys.stderr)
        return 1

    model = SentenceTransformer(model_name)
    q = model.encode([args.query], convert_to_numpy=True)[0].astype(np.float32)
    q = q / (np.linalg.norm(q) + 1e-12)
    En = E / (np.linalg.norm(E, axis=1, keepdims=True) + 1e-12)
    scores = En @ q
    top_idx = np.argsort(-scores)[: args.top_k]

    for rank, i in enumerate(top_idx, start=1):
        row = manifest[int(i)]
        body = row.get("text") or ""
        print(f"--- rank {rank} score={float(scores[i]):.4f} ---")
        print(f"id={row.get('id')} source={row.get('source')} chunk={row.get('chunk')}")
        print(body[:2000])
        if len(body) > 2000:
            print("… [truncated]")
        print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
