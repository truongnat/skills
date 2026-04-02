#!/usr/bin/env bash
# Build skill_index.json (and optionally embeddings).
# Usage: ./scripts/build_skill_index.sh [--with-embeddings]
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$REPO_ROOT/dist/tools.js" build-skill-index "$@"
