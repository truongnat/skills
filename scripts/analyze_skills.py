#!/usr/bin/env python3
"""
Heuristic report: which bundled skills imply automation (CLI, batch, FFmpeg, CI)
but do not reference repo scripts under scripts/. For authors and CI review.

Scans skills/*/SKILL.md; optional --with-references includes references/*.md.
Use --self-review for a full Markdown report (tier counts, all skills, manual checklist).

No ML — fast.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
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
# Note: "ci/pipeline" is weight 1 — the word CI appears often in prose; avoid false positives.
SIGNALS: list[tuple[re.Pattern[str], int, str]] = [
    (re.compile(r"\bffmpeg\b", re.I), 4, "ffmpeg"),
    (re.compile(r"\bffprobe\b", re.I), 4, "ffprobe"),
    (re.compile(r"\bocr\b", re.I), 2, "ocr"),
    (re.compile(r"\bbinary\b|\bcli\b|\bsubprocess\b", re.I), 2, "cli/subprocess"),
    (re.compile(r"\bci\b|\bcron\b|\bgithub actions\b|\bpipeline\b", re.I), 1, "ci/pipeline"),
    (re.compile(r"\bbatch\b", re.I), 2, "batch"),
    (re.compile(r"\bautomate\b|\bautomation\b", re.I), 2, "automation"),
    (re.compile(r"\brun\s+(the\s+)?(script|tool|command)", re.I), 2, "run-script"),
    (re.compile(r"\bshell\b|\bbash\b|\bpowershell\b", re.I), 2, "shell"),
]

# Skills whose job is CI/deploy/security/etc.; mention of CI in text is not a repo-script gap.
DOMAIN_AUTOMATION_OK = frozenset(
    {
        "deployment-pro",
        "testing-pro",
        "code-packaging-pro",
        "security-pro",
        "seo-pro",
        "electron-pro",
        "tauri-pro",
        "bug-discovery-pro",
        "git-operations-pro",
    },
)

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
    elif folder in DOMAIN_AUTOMATION_OK:
        tier = "low"
        note = (
            "Domain skill (CI/deploy/tooling/etc.); mentions of automation in prose are expected; "
            "link `scripts/README.md` only if this repo's scripts are relevant."
        )
    elif ("ffmpeg" in signal_labels or "ffprobe" in signal_labels) or score >= 11:
        tier = "strong"
        note = "Heavy automation signals; add or link a helper under scripts/ (or document project-local scripts)."
    elif score >= 6:
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


def print_tier_distribution(rows: list[dict], tier_order: tuple[str, ...]) -> None:
    counts = Counter(r["tier"] for r in rows)
    print("## Tier distribution (all bundled skills)\n")
    print("| tier | count |")
    print("|------|-------|")
    for t in tier_order:
        n = counts.get(t, 0)
        if n:
            print(f"| `{t}` | {n} |")
    print()


def print_full_skill_table(rows: list[dict]) -> None:
    print("## All bundled skills\n")
    print("| tier | score | repo_ref | signals | folder | name |")
    print("|------|-------|----------|---------|--------|------|")
    for r in sorted(rows, key=lambda x: (x["tier"], x["folder"])):
        sig = ", ".join(r["signals"]) if r["signals"] else "-"
        ref = "yes" if r["references_repo_scripts"] else "no"
        nm = r["name"] or "(missing)"
        print(
            f"| {r['tier']} | {r['automation_score']} | {ref} | {sig} | "
            f"{r['folder']} | {nm} |",
        )
    print()


def print_self_review_markdown(rows: list[dict]) -> None:
    """Full report for skills-self-review-pro / maintainers."""
    tier_order = ("strong", "consider", "unknown", "low", "ok", "exempt")
    actionable = [r for r in rows if r["tier"] in ("strong", "consider", "unknown")]

    print("# Skills self-review (this repository)\n")
    print(
        "Heuristic automation-vs-`scripts/` analysis. "
        "Pair with **`skills/SKILL_AUTHORING_RULES.md`** for structure. "
        "Skill **`skills-self-review-pro`** describes the workflow.\n",
    )
    print("## 1. Validate frontmatter vs folder names\n")
    print("Run from repo root (must exit 0 before trusting this report):\n")
    print("```bash\npython scripts/validate_skills.py\n```\n")

    print("## 2. Automation vs repo scripts - actionable gaps\n")
    if not actionable:
        print(
            "**None.** No skill is in `strong`, `consider`, or `unknown` for "
            "script-linking heuristics.\n",
        )
    else:
        print("| tier | score | folder | note |")
        print("|------|-------|--------|------|")
        for r in sorted(actionable, key=lambda x: (x["tier"], x["folder"])):
            note = r["note"].replace("|", "\\|")
            print(
                f"| {r['tier']} | {r['automation_score']} | {r['folder']} | {note} |",
            )
        print()

    print_tier_distribution(rows, tier_order)
    print_full_skill_table(rows)

    print("## 3. Per-skill notes (automation heuristic)\n")
    for r in sorted(rows, key=lambda x: x["folder"]):
        print(f"- **{r['folder']}** (`{r['tier']}`): {r['note']}")
    print()

    print("## 4. Manual checks (not covered by this script)\n")
    print(
        "- Section order and workflow in **`skills/SKILL_AUTHORING_RULES.md`** (sections 2-5).\n"
        "- Same-change documentation (authoring rules section 8) when adding/removing skills or KB docs.\n"
        "- After editing **`knowledge-base/documents/`**:** `python scripts/build_kb.py` "
        "then **`python scripts/verify_kb.py`**.\n"
        "- Script index: **`scripts/README.md`**; meta skill: **`skills-self-review-pro`**.\n",
    )


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
        "--markdown",
        action="store_true",
        help="Print a Markdown report (tiers, table, improvement notes) for self-review docs.",
    )
    parser.add_argument(
        "--only-actionable",
        action="store_true",
        help="Print only strong/consider tiers (and unknown).",
    )
    parser.add_argument(
        "--self-review",
        action="store_true",
        help=(
            "Full Markdown self-review for this repo: validate_skills reminder, "
            "tier counts, actionable section, full skill table, manual checklist. "
            "Implies --markdown and --with-references."
        ),
    )
    args = parser.parse_args()

    if args.self_review:
        args.markdown = True
        args.with_references = True

    skills_dir = repo_root() / "skills"
    rows: list[dict] = []
    for d in iter_skill_dirs(skills_dir, args.include_template):
        rel = str(d.relative_to(skills_dir))
        rows.append(analyze_one(d, rel, args.with_references))

    if args.json:
        json.dump(rows, sys.stdout, ensure_ascii=False, indent=2)
        sys.stdout.write("\n")
        return 0

    if args.self_review:
        print_self_review_markdown(rows)
        return 0

    if args.markdown:
        def include_row(r: dict) -> bool:
            if args.only_actionable and r["tier"] in ("ok", "exempt", "low"):
                return False
            return True

        filtered = [r for r in rows if include_row(r)]

        print("# Skill bundle - automation vs scripts (heuristic)\n")
        print(
            "Generated by `analyze_skills.py`. "
            "**Not** a full quality audit - combines keyword signals with "
            "`scripts/` / `repo-tooling-pro` references.\n"
        )
        tier_order = ("strong", "consider", "unknown", "low", "ok", "exempt")

        if args.only_actionable and not filtered:
            print(
                "## Actionable tiers (strong / consider / unknown)\n\n"
                "**None.** No skill matched those tiers. "
                "Heuristics may be tuned (see `DOMAIN_AUTOMATION_OK` and weights in this script) "
                "or the bundle is clean for *script-linking* gaps.\n\n"
                "Use **`python scripts/analyze_skills.py --self-review`** for a full repo report "
                "(tier counts + all skills).\n",
            )
            print_tier_distribution(rows, tier_order)
            print_full_skill_table(rows)
            print("\n## Improvement notes (all skills)\n")
            for r in rows:
                print(f"- **{r['folder']}:** {r['note']}")
            print()
            return 0

        print("## Summary by tier\n")
        by_tier: dict[str, list[dict]] = {t: [] for t in tier_order}
        for r in filtered:
            by_tier.setdefault(r["tier"], []).append(r)
        for t in tier_order:
            items = by_tier.get(t, [])
            if not items:
                continue
            print(f"### `{t}` ({len(items)})\n")
            for r in items:
                nm = r["name"] or r["folder"]
                print(f"- **{r['folder']}** (`{nm}`) - score {r['automation_score']}")
            print()
        print("## Detail table\n")
        print("| tier | score | repo_ref | signals | folder | name |")
        print("|------|-------|----------|---------|--------|------|")
        for r in filtered:
            sig = ", ".join(r["signals"]) if r["signals"] else "-"
            ref = "yes" if r["references_repo_scripts"] else "no"
            nm = r["name"] or "(missing)"
            print(
                f"| {r['tier']} | {r['automation_score']} | {ref} | {sig} | "
                f"{r['folder']} | {nm} |",
            )
        print("\n## Improvement notes\n")
        for r in filtered:
            print(f"- **{r['folder']}:** {r['note']}")
        print()
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
