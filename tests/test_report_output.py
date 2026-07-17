from __future__ import annotations

from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]


def test_default_report_output_format_is_markdown() -> None:
    settings = (REPO_ROOT / "docs" / "settings.yaml").read_text(encoding="utf-8")
    assert "output_format: markdown" in settings


def test_agent_rules_define_html_artifact_compatibility() -> None:
    rules = (REPO_ROOT / "docs" / "AGENTS.md").read_text(encoding="utf-8")
    assert "## Artifact format resolution" in rules
    assert "then fall back to the" in rules
    assert "alternate extension" in rules
    assert "session-serve/serve.py" in rules
    assert "choice-reader" in rules
