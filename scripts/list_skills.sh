#!/usr/bin/env bash
# List all bundled skills.
# Usage: ./scripts/list_skills.sh [--json] [--include-template]
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$REPO_ROOT/dist/tools.js" list-skills "$@"
