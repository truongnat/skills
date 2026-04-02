#!/usr/bin/env bash
# Validate SKILL.md frontmatter `name` matches folder name for all skills.
# Usage: ./scripts/validate_skills.sh [--include-template]
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$REPO_ROOT/dist/tools.js" validate-skills "$@"
