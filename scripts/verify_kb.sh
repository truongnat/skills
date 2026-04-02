#!/usr/bin/env bash
# Verify knowledge-base artifacts are present and consistent.
# Usage: ./scripts/verify_kb.sh
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$REPO_ROOT/dist/tools.js" verify-kb "$@"
