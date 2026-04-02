#!/usr/bin/env bash
# Build knowledge-base embeddings and manifest from documents/.
# Usage: ./scripts/build_kb.sh
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$REPO_ROOT/dist/tools.js" build-kb "$@"
