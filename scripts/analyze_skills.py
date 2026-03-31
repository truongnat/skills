#!/usr/bin/env python3
"""
Heuristic report: which bundled skills imply automation (CLI, batch, FFmpeg, CI)
but do not reference repo scripts under scripts/. For authors and CI review.

Scans skills/*/SKILL.md; optional --with-references includes references/*.md.
No ML — fast.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parent.parent


def parse_frontmatter_name(text: str) -> str | None:
    if not text.startswith("---"):
        return None
    m = re.search(r"^name:\s*(.+)$", text, re.MULTILINE)
    if not m:
        return None
    return m.group(1).strip().strip("\"'")


def iter_skill_dirs(skills_dir: Path, include_template: bool) -> list[Path]:
    out: list[Path] = []
    for skill_md in sorted(skills_dir.glob("*/SKILL.md")):
        out.append(skill_md.parent)
    if include_template:
        for skill_md in sorted(skills_dir.glob("*/*/SKILL.md")):
            out.append(skill_md.parent)
    return out


# Weighted signals: (regex, weight, label)
SIGNALS: list[tuple[re.Pattern[str], int, str]] = [
    (re.compile(r"\bffmpeg\b", re.I), 4, "ffmpeg"),
    (re.compile(r"\bffprobe\b", re.I), 4, "ffprobe"),
    (re.compile(r"\bocr\b", re.I), 2, "ocr"),
    (re.compile(r"\bbinary\b|\bcli\b|\bsubprocess\b", re.I), 2, "cli/subprocess"),
    (re.compile(r"\bci\b|\bcron\b|\bgithub actions\b|\bpipeline\b", re.I), 3, "ci/pipeline"),
    (re.compile(r"\bbatch\b", re.I), 2, "batch"),
    (re.compile(r"\bautomate\b|\bautomation\b", re.I), 2, "automation"),
    (re.compile(r"\brun\s+(the\s+)?(script|tool|command)", re.I), 2, "run-script"),
    (re.compile(r"\bshell\b|\bbash\b|\bpowershell\b", re.I), 2, "shell"),
]

REPO_SCRIPT_REF = re.compile(
    r"scripts/README\.md|scripts/|`scripts/|"
    r"\bquery_kb_batch\b|\bquery_kb\.py\b|\bbuild_kb\b|\bverify_kb\b|"
    r"\bvalidate_skills\b|\blist_skills\b|\brepo-tooling-pro\b|\banalyze_skills\b",
    re.I,
)

EXEMPT_FOLDERS = frozenset({"repo-tooling-pro"})


def collect_text(skill_dir: Path, with_references: bool) -> str:
    parts: list[str] = []
    md = skill_dir / "SKILL.md"
    if md.is_file():
        parts.append(md.read_text(encoding="utf-8"))
    if with_references:
        ref_dir = skill_dir / "references"
        if ref_dir.is_dir():
            for p in sorted(ref_dir.glob("*.md")):
                parts.append(p.read_text(encoding="utf-8"))
    return "\n".join(parts)


def score_signals(text: str) -> tuple[int, list[str]]:
    total = 0
    labels: list[str] = []
    for pat, w, label in SIGNALS:
        if pat.search(text):
            total += w
            if label not in labels:
                labels.append(label)
    return total, labels


def analyze_one(skill_dir: Path, rel: str, with_references: bool) -> dict:
    text = collect_text(skill_dir, with_references)
    score, signal_labels = score_signals(text)
    has_repo_ref = bool(REPO_SCRIPT_REF.search(text))
    folder = skill_dir.name
    name = None
    sm = skill_dir / "SKILL.md"
    if sm.is_file():
        name = parse_frontmatter_name(sm.read_text(encoding="utf-8"))

    if folder in EXEMPT_FOLDERS:
        tier = "exempt"
        note = "Repo tooling skill - owns scripts/ documentation."
    elif not text.strip():
        tier = "unknown"
        note = "No text scanned."
    elif has_repo_ref:
        tier = "ok"
        note = "References repo scripts or tooling skill."
    elif ("ffmpeg" in signal_labels or "ffprobe" in signal_labels) or score >= 12:
        tier = "strong"
        note = "Heavy automation signals; add or link a helper under scripts/ (or document project-local scripts)."
    elif score >= 4:
        tier = "consider"
        note = "Some automation keywords; if users repeat the same steps, add a small script or workflow."
    else:
        tier = "low"
        note = "Mostly procedural Markdown; optional scripts only if usage repeats."

    return {
        "folder": rel.replace("\\", "/"),
        "name": name,
        "automation_score": score,
        "signals": signal_labels,
        "references_repo_scripts": has_repo_ref,
        "with_references": with_references,
        "tier": tier,
        "note": note,
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Report heuristic script-support needs for bundled skills.",
    )
    parser.add_argument(
        "--with-references",
        action="store_true",
        help="Include references/*.md in scan (stronger signals for content-heavy skills).",
    )
    parser.add_argument(
        "--include-template",
        action="store_true",
        help="Include examples/skill-template",
    )
    parser.add_argument("--json", action="store_true", help="Print JSON array")
    parser.add_argument(
        "--only-actionable",
        action="store_true",
        help="Print only strong/consider tiers (and unknown).",
    )
    args = parser.parse_args()

    skills_dir = repo_root() / "skills"
    rows: list[dict] = []
    for d in iter_skill_dirs(skills_dir, args.include_template):
        rel = str(d.relative_to(skills_dir))
        rows.append(analyze_one(d, rel, args.with_references))

    if args.json:
        json.dump(rows, sys.stdout, ensure_ascii=False, indent=2)
        sys.stdout.write("\n")
        return 0

    header = (
        "tier\tscore\trepo_ref\tsignals\tfolder\tname\n"
        "----\t-----\t--------\t-------\t------\t----"
    )
    print(header)
    for r in rows:
        if args.only_actionable and r["tier"] in ("ok", "exempt", "low"):
            continue
        sig = ",".join(r["signals"]) if r["signals"] else "-"
        ref = "yes" if r["references_repo_scripts"] else "no"
        nm = r["name"] or "(missing)"
        print(
            f"{r['tier']}\t{r['automation_score']}\t{ref}\t{sig}\t{r['folder']}\t{nm}",
        )
    print()
    print("Notes per skill:")
    for r in rows:
        if args.only_actionable and r["tier"] in ("ok", "exempt", "low"):
            continue
        print(f"  [{r['folder']}] {r['note']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
