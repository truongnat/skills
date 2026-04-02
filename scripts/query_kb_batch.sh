#!/usr/bin/env bash
# Batch-query the knowledge base — one model load for many queries.
# Prefer this over calling query_kb.sh in a loop.
# Usage: ./scripts/query_kb_batch.sh -q "question 1" -q "question 2" ...
#        ./scripts/query_kb_batch.sh -f queries.txt
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$REPO_ROOT/dist/tools.js" query-kb-batch "$@"
