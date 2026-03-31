#!/usr/bin/env python3
"""
Run multiple KB queries with a SINGLE model load (faster than invoking query_kb.py per query).

Loads embeddings + SentenceTransformer once, encodes all query strings, prints results per query.
Config: same as query_kb.py (config.md / config.example.md).
"""
from __future__ import annotations

import argparse
import io
import json
import sys
from pathlib import Path

if hasattr(sys.stdout, "buffer") and sys.stdout.encoding and sys.stdout.encoding.lower() not in (
    "utf-8",
    "utf8",
):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)

import numpy as np
from sentence_transformers import SentenceTransformer

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))
from kb_config_md import kb_paths_from_config, load_kb_config


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def load_index(root: Path):
    cfg = load_kb_config(root)
    _doc, model_name, emb_rel, man_rel, _cs, _ov = kb_paths_from_config(cfg)
    emb_path = (root / emb_rel).resolve()
    man_path = (root / man_rel).resolve()
    if not emb_path.is_file() or not man_path.is_file():
        return None, None, None, None, None
    E = np.load(str(emb_path))
    with man_path.open(encoding="utf-8") as f:
        manifest: list[dict] = json.load(f)
    if len(manifest) != E.shape[0]:
        return None, None, None, None, None
    return E, manifest, model_name, emb_path, man_path


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Batch-query KB: one model load, multiple questions (performance helper)."
    )
    parser.add_argument(
        "-q",
        "--query",
        action="append",
        dest="queries",
        help="Query string (repeat -q for multiple)",
    )
    parser.add_argument(
        "-f",
        "--file",
        type=Path,
        help="File with one query per line (UTF-8); ignores empty lines and # comments",
    )
    parser.add_argument("-k", "--top-k", type=int, default=5, help="Top chunks per query (default: 5)")
    parser.add_argument(
        "--json",
        action="store_true",
        help="Print machine-readable JSON (one object per query)",
    )
    args = parser.parse_args()

    queries: list[str] = []
    if args.queries:
        queries.extend(args.queries)
    if args.file:
        if not args.file.is_file():
            print(f"Not a file: {args.file}", file=sys.stderr)
            return 1
        raw = args.file.read_text(encoding="utf-8")
        for line in raw.splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            queries.append(line)
    if not queries:
        parser.error("Provide at least one query via -q or --file")

    root = repo_root()
    loaded = load_index(root)
    E, manifest, model_name, emb_path, man_path = loaded
    if E is None:
        print(
            f"Index not found or invalid. Expected embeddings + manifest.\n"
            f"  Tried: {emb_path}\n  {man_path}\n"
            "Run: python scripts/build_kb.py",
            file=sys.stderr,
        )
        return 1

    model = SentenceTransformer(model_name)
    En = E / (np.linalg.norm(E, axis=1, keepdims=True) + 1e-12)

    encoded = model.encode(queries, convert_to_numpy=True).astype(np.float32)
    encoded = encoded / (np.linalg.norm(encoded, axis=1, keepdims=True) + 1e-12)

    results: list[dict] = []
    for qi, qvec in enumerate(encoded):
        scores = En @ qvec
        top_idx = np.argsort(-scores)[: args.top_k]
        rows = []
        for rank, i in enumerate(top_idx, start=1):
            i = int(i)
            row = manifest[i]
            body = row.get("text") or ""
            rows.append(
                {
                    "rank": rank,
                    "score": float(scores[i]),
                    "id": row.get("id"),
                    "source": row.get("source"),
                    "chunk": row.get("chunk"),
                    "text_preview": body[:2000] + ("… [truncated]" if len(body) > 2000 else ""),
                }
            )
        results.append({"query": queries[qi], "top": rows})

    if args.json:
        json.dump(results, sys.stdout, ensure_ascii=False, indent=2)
        sys.stdout.write("\n")
        return 0

    for block in results:
        print(f"======== QUERY: {block['query']}")
        for r in block["top"]:
            print(f"--- rank {r['rank']} score={r['score']:.4f} ---")
            print(f"id={r['id']} source={r['source']} chunk={r['chunk']}")
            print(r["text_preview"])
            print()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
