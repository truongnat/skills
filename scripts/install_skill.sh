#!/usr/bin/env bash
# Install a single skill into a target project.
# Usage: ./scripts/install_skill.sh <skill-path> [--project-dir <dir>] [--all-ides]
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$REPO_ROOT/dist/tools.js" install-skill "$@"
