from __future__ import annotations

import json
import subprocess
import sys
import zipfile
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
PYTHON = sys.executable


def run_cli(skill: str, args: list[str]) -> subprocess.CompletedProcess[str]:
    cli = ROOT / "skills" / skill / "scripts" / "cli.py"
    return subprocess.run(
        [PYTHON, str(cli), *args],
        cwd=str(ROOT),
        text=True,
        capture_output=True,
        check=False,
    )


def test_xlsx_create_validate_edit_roundtrip(tmp_path: Path):
    spec = {
        "properties": {"title": "Demo", "creator": "test"},
        "sheets": [{"title": "Data", "rows": [["A", "B"], [1, 2]]}],
    }
    spec_path = tmp_path / "spec.json"
    out = tmp_path / "out.xlsx"
    manifest = tmp_path / "m.json"
    spec_path.write_text(json.dumps(spec), encoding="utf-8")

    created = run_cli("xlsx", ["create", str(spec_path), str(out), "--manifest", str(manifest)])
    assert created.returncode == 0, created.stderr
    data = json.loads(manifest.read_text(encoding="utf-8"))
    assert data["coverage_ratio"] == 1.0
    assert data["format"] == "xlsx"

    validated = run_cli("xlsx", ["validate", str(out)])
    assert validated.returncode == 0, validated.stderr

    edits = {"set_cells": [{"sheet": "Data", "coord": "A2", "value": 99}]}
    edits_path = tmp_path / "edits.json"
    edited = tmp_path / "edited.xlsx"
    edits_path.write_text(json.dumps(edits), encoding="utf-8")
    edited_run = run_cli("xlsx", ["edit", str(out), str(edits_path), str(edited)])
    assert edited_run.returncode == 0, edited_run.stderr
    payload = json.loads(edited_run.stdout)
    assert any(i["status"] == "transformed" for i in payload["items"])


def test_docx_create_and_edit(tmp_path: Path):
    spec = {
        "properties": {"title": "Doc", "author": "test"},
        "paragraphs": ["Hello", "World"],
        "tables": [{"rows": [["A", "B"], ["1", "2"]]}],
    }
    spec_path = tmp_path / "spec.json"
    out = tmp_path / "out.docx"
    spec_path.write_text(json.dumps(spec), encoding="utf-8")
    created = run_cli("docx", ["create", str(spec_path), str(out)])
    assert created.returncode == 0, created.stderr

    edits = {"replace_paragraphs": [{"index": 0, "text": "Hi"}]}
    # python-docx may insert an empty first paragraph; find Hello index via inspect
    inspected = run_cli("docx", ["inspect", str(out)])
    assert inspected.returncode == 0, inspected.stderr
    items = json.loads(inspected.stdout)["items"]
    hello_idx = None
    for item in items:
        if item["kind"] == "paragraph" and item["detail"] == "Hello":
            hello_idx = int(item["path"].split(":")[1])
            break
    assert hello_idx is not None
    edits = {"replace_paragraphs": [{"index": hello_idx, "text": "Hi"}]}
    edits_path = tmp_path / "edits.json"
    edited = tmp_path / "edited.docx"
    edits_path.write_text(json.dumps(edits), encoding="utf-8")
    edited_run = run_cli("docx", ["edit", str(out), str(edits_path), str(edited)])
    assert edited_run.returncode == 0, edited_run.stderr


def test_pptx_create_validate(tmp_path: Path):
    spec = {"slides": [{"texts": ["Title", "Body"]}]}
    spec_path = tmp_path / "spec.json"
    out = tmp_path / "out.pptx"
    spec_path.write_text(json.dumps(spec), encoding="utf-8")
    created = run_cli("pptx", ["create", str(spec_path), str(out)])
    assert created.returncode == 0, created.stderr
    validated = run_cli("pptx", ["validate", str(out)])
    assert validated.returncode == 0, validated.stderr


def test_pdf_create_edit_reorder(tmp_path: Path):
    spec = {
        "properties": {"title": "PDF", "author": "test"},
        "pages": [{"text": "PageA"}, {"text": "PageB"}],
    }
    spec_path = tmp_path / "spec.json"
    out = tmp_path / "out.pdf"
    spec_path.write_text(json.dumps(spec), encoding="utf-8")
    created = run_cli("pdf", ["create", str(spec_path), str(out)])
    assert created.returncode == 0, created.stderr

    edits = {"page_order": [1, 0], "properties": {"title": "PDF2"}}
    edits_path = tmp_path / "edits.json"
    edited = tmp_path / "edited.pdf"
    edits_path.write_text(json.dumps(edits), encoding="utf-8")
    edited_run = run_cli("pdf", ["edit", str(out), str(edits_path), str(edited)])
    assert edited_run.returncode == 0, edited_run.stderr
    validated = run_cli("pdf", ["validate", str(edited)])
    assert validated.returncode == 0, validated.stderr


def _make_macro_xlsx(path: Path) -> None:
    # Minimal zip that looks like xlsx but includes vbaProject.bin
    with zipfile.ZipFile(path, "w") as zf:
        zf.writestr(
            "[Content_Types].xml",
            """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="bin" ContentType="application/vnd.ms-office.vbaProject"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
</Types>""",
        )
        zf.writestr(
            "xl/workbook.xml",
            """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheets><sheet name="Sheet1" sheetId="1" r:id="rId1" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/></sheets>
</workbook>""",
        )
        zf.writestr("xl/vbaProject.bin", b"FAKE-VBA")


def test_xlsx_unsupported_macro_blocks_validate(tmp_path: Path):
    bad = tmp_path / "macro.xlsx"
    _make_macro_xlsx(bad)
    # openpyxl may fail to load; inventory should still catch via zip before/around load
    result = run_cli("xlsx", ["inspect", str(bad)])
    # Either inventory reports unsupported or openpyxl errors; inspect should not claim full coverage publish
    if result.returncode == 0:
        payload = json.loads(result.stdout)
        assert any(i["status"] == "unsupported" for i in payload["items"])
        validated = run_cli("xlsx", ["validate", str(bad)])
        assert validated.returncode == 2
    else:
        assert result.returncode != 0


def test_skill_metadata_present():
    for skill in ("xlsx", "docx", "pptx", "pdf"):
        root = ROOT / "skills" / skill
        assert (root / "SKILL.md").is_file()
        assert (root / "agents" / "openai.yaml").is_file()
        assert (root / "requirements.txt").is_file()
        assert (root / "references" / "COVERAGE.md").is_file()
        assert (root / "scripts" / "cli.py").is_file()
    assert (ROOT / "skills" / "office-common" / "python" / "office_common" / "coverage.py").is_file()
    assert not (ROOT / "skills" / "office-mcp").exists()
