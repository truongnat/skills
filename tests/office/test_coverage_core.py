from __future__ import annotations

from pathlib import Path

import pytest

from office_common.atomic import atomic_publish
from office_common.coverage import CoverageError, CoverageManifest
from office_common.fingerprint import semantic_fingerprint


def test_coverage_ratio_requires_preserved_on_create():
    m = CoverageManifest(format="xlsx", operation="create", source=None, output="out.xlsx")
    m.add("a", "cell", "preserved")
    m.add("b", "cell", "preserved")
    assert m.coverage_ratio == 1.0
    m.require_full_coverage()


def test_unsupported_blocks():
    m = CoverageManifest(format="xlsx", operation="edit", source="in.xlsx", output="out.xlsx")
    m.add("xl/vbaProject.bin", "ooxml-part", "unsupported", "macro")
    with pytest.raises(CoverageError):
        m.require_full_coverage()


def test_skipped_does_not_reduce_ratio():
    m = CoverageManifest(format="pdf", operation="validate", source="a.pdf", output=None)
    m.add("page:0", "page", "preserved")
    m.add("tool:tesseract", "optional-check", "skipped", "missing")
    assert m.coverage_ratio == 1.0


def test_fingerprint_stable():
    a = semantic_fingerprint({"b": 1, "a": [1, 2]})
    b = semantic_fingerprint({"a": [1, 2], "b": 1})
    assert a == b


def test_atomic_publish_rolls_back_on_validation_failure(tmp_path: Path):
    dest = tmp_path / "file.txt"
    dest.write_text("original", encoding="utf-8")

    def writer(tmp: Path) -> None:
        tmp.write_text("new", encoding="utf-8")

    def validator(_tmp: Path) -> None:
        raise RuntimeError("nope")

    with pytest.raises(RuntimeError):
        atomic_publish(dest, writer, validator)
    assert dest.read_text(encoding="utf-8") == "original"
    assert list(tmp_path.glob(".file.txt.*.tmp")) == []


def test_atomic_publish_success(tmp_path: Path):
    dest = tmp_path / "file.txt"

    def writer(tmp: Path) -> None:
        tmp.write_text("ok", encoding="utf-8")

    atomic_publish(dest, writer, lambda p: None)
    assert dest.read_text(encoding="utf-8") == "ok"
