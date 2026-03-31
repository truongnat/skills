#!/usr/bin/env python3
"""
Pre-build a searchable skill index from skills/*/SKILL.md.
Extracts name, description, trigger keywords, when-to-use bullets, and references.
Output: skill_index.json (and optionally skill_embeddings.npy with --with-embeddings).

Run once after adding/changing skills.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))
from kb_config_md import load_kb_config


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def iter_skill_dirs(skills_dir: Path) -> list[Path]:
    out: list[Path] = []
    for skill_md in sorted(skills_dir.glob("*/SKILL.md")):
        out.append(skill_md.parent)
    return out


def parse_frontmatter(text: str) -> str:
    """Return raw frontmatter block (between first pair of ---)."""
    if not text.startswith("---"):
        return ""
    parts = text.split("---", 2)
    if len(parts) >= 3:
        return parts[1]
    return ""


def parse_name(fm: str) -> str | None:
    m = re.search(r"^name:\s*(.+)$", fm, re.MULTILINE)
    if not m:
        return None
    return m.group(1).strip().strip("\"'")


def parse_description(fm: str) -> str:
    """Extract multiline description: | block from frontmatter."""
    m = re.search(r"^description:\s*\|?\s*\n(.*?)(?=^\S|\Z)", fm, re.MULTILINE | re.DOTALL)
    if not m:
        return ""
    return m.group(1).strip()


def parse_triggers(description: str) -> list[str]:
    """Extract trigger keywords from Triggers: line in description."""
    m = re.search(r'Triggers?:\s*(.+)', description, re.IGNORECASE)
    if not m:
        return []
    raw = m.group(1)
    triggers = re.findall(r'"([^"]+)"', raw)
    if not triggers:
        triggers = re.findall(r'`([^`]+)`', raw)
    return [t.strip().lower() for t in triggers if t.strip()]


def parse_when_to_use(text: str) -> list[str]:
    """Extract bullets from ## When to use section."""
    m = re.search(r"## When to use\s*\n(.*?)(?=\n##|\Z)", text, re.DOTALL)
    if not m:
        return []
    bullets: list[str] = []
    for line in m.group(1).splitlines():
        line = line.strip()
        if line.startswith("- ") and "trigger keywords" not in line.lower():
            bullets.append(line[2:].strip())
    return bullets


def list_references(skill_dir: Path) -> list[str]:
    refs_dir = skill_dir / "references"
    if not refs_dir.is_dir():
        return []
    return sorted(f.name for f in refs_dir.glob("*.md"))


def parse_skill_metadata(skill_dir: Path) -> dict | None:
    """Parse a single skill directory into an index entry."""
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.is_file():
        return None
    text = skill_md.read_text(encoding="utf-8")
    fm = parse_frontmatter(text)
    name = parse_name(fm)
    if not name:
        return None

    description = parse_description(fm)
    triggers = parse_triggers(description)
    when_to_use = parse_when_to_use(text)
    references = list_references(skill_dir)

    # Also extract trigger keywords from ## When to use last bullet
    wtu_text = "\n".join(when_to_use)
    wtu_triggers = parse_triggers(wtu_text)
    all_triggers = list(dict.fromkeys(triggers + wtu_triggers))  # dedup, preserve order

    return {
        "name": name,
        "folder": skill_dir.name,
        "description": description,
        "triggers": all_triggers,
        "when_to_use": when_to_use,
        "references": references,
    }


def build_index(skills_dir: Path) -> list[dict]:
    """Build full skill index in memory."""
    index: list[dict] = []
    for d in iter_skill_dirs(skills_dir):
        entry = parse_skill_metadata(d)
        if entry:
            index.append(entry)
    return index


def main() -> int:
    parser = argparse.ArgumentParser(description="Build searchable skill index from SKILL.md files.")
    parser.add_argument("--dry-run", action="store_true", help="Preview skills and trigger counts")
    parser.add_argument("--with-embeddings", action="store_true", help="Also generate semantic embeddings")
    parser.add_argument(
        "--output",
        default=None,
        help="Output path for skill_index.json (default: from config or knowledge-base/embeddings/)",
    )
    args = parser.parse_args()

    root = repo_root()
    skills_dir = root / "skills"

    cfg = load_kb_config(root)
    index_path = root / (cfg.get("skill_index_path") or "knowledge-base/embeddings/skill_index.json")
    emb_path = root / (cfg.get("skill_embeddings_path") or "knowledge-base/embeddings/skill_embeddings.npy")
    if args.output:
        index_path = Path(args.output).resolve()

    index = build_index(skills_dir)

    if args.dry_run:
        print(f"Skills found: {len(index)}")
        print(f"Index path:   {index_path}")
        if args.with_embeddings:
            print(f"Embeddings:   {emb_path}")
        print()
        for entry in index:
            print(f"  {entry['name']:<35} triggers={len(entry['triggers']):<3} refs={len(entry['references'])}")
        total_triggers = sum(len(e["triggers"]) for e in index)
        print(f"\nTotal triggers: {total_triggers}")
        return 0

    index_path.parent.mkdir(parents=True, exist_ok=True)
    with index_path.open("w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(index)} skills -> {index_path}")

    if args.with_embeddings:
        import numpy as np
        from sentence_transformers import SentenceTransformer

        model_name = cfg.get("embedding_model") or "sentence-transformers/all-MiniLM-L6-v2"
        texts = []
        for entry in index:
            combined = entry["description"] + "\n" + "\n".join(entry["when_to_use"])
            texts.append(combined)

        print(f"Loading embedding model: {model_name} ...")
        model = SentenceTransformer(model_name)
        print("Encoding skill descriptions ...")
        embeddings = model.encode(texts, show_progress_bar=True, convert_to_numpy=True)
        embeddings = np.asarray(embeddings, dtype=np.float32)

        np.save(str(emb_path), embeddings)
        print(f"Saved {len(index)} skill embeddings -> {emb_path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
