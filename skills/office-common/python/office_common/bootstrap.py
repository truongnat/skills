"""Locate the office_common package from a skill scripts/ directory."""

from __future__ import annotations

import sys
from pathlib import Path


def ensure_office_common_on_path(script_file: str | Path) -> Path:
    """Insert skills/office-common/python onto sys.path.

    Works for both repo layout:
      skills/<skill>/scripts/cli.py
      skills/office-common/python/office_common/...
    and installed layout:
      .agents/skills/<skill>/scripts/cli.py
      .agents/skills/office-common/python/office_common/...
    """
    script = Path(script_file).resolve()
    skills_root = script.parents[2]  # .../skills
    candidate = skills_root / "office-common" / "python"
    if not (candidate / "office_common").is_dir():
        raise RuntimeError(
            f"office-common package not found at {candidate}. "
            "Ensure office-common is installed beside the office skills."
        )
    path = str(candidate)
    if path not in sys.path:
        sys.path.insert(0, path)
    return candidate
