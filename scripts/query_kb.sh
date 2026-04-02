#!/usr/bin/env bash
# Query the knowledge base with a single prompt.
# Usage: ./scripts/query_kb.sh "your question here" [-k <top_k>]
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$REPO_ROOT/dist/tools.js" query-kb "$@"
