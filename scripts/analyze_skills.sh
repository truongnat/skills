#!/usr/bin/env bash
# Skill gap heuristics report — identify missing references, weak descriptions, etc.
# Usage: ./scripts/analyze_skills.sh [--markdown] [--only-actionable] [--with-references] [--self-review]
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$REPO_ROOT/dist/tools.js" analyze-skills "$@"
