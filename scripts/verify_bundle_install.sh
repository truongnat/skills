#!/usr/bin/env bash
# Verify that the full skill bundle is correctly installed in a project.
# Usage: ./scripts/verify_bundle_install.sh [--project-dir <dir>]
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$REPO_ROOT/dist/tools.js" verify-bundle-install "$@"
