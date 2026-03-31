#!/usr/bin/env bash
# Remote uninstall: curl -fsSL https://raw.githubusercontent.com/truongnat/skills/main/uninstall-remote.sh | bash
set -euo pipefail

DEFAULT_REPO="https://github.com/truongnat/skills.git"
TEMP_DIR=""
CLEANUP_TEMP=false

cleanup() {
    if [ "$CLEANUP_TEMP" = true ] && [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
        rm -rf "$TEMP_DIR"
    fi
}
trap cleanup EXIT

REPO_URL="$DEFAULT_REPO"
FORCE=false
NUCLEAR=false
PROJECT_DIR="$(pwd)"

while [[ $# -gt 0 ]]; do
    case $1 in
        --repo)
            REPO_URL="$2"
            shift 2
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --nuclear)
            NUCLEAR=true
            shift
            ;;
        --project-dir)
            PROJECT_DIR="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: curl … | bash  [ --repo URL ] [ --force ] [ --nuclear ] [ --project-dir DIR ]"
            exit 0
            ;;
        *)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
    esac
done

# Piped stdin: no confirmation prompt
if [ ! -t 0 ] && [ "$FORCE" = false ]; then
    FORCE=true
fi

command -v git >/dev/null 2>&1 || {
    echo "git required" >&2
    exit 1
}

TEMP_DIR=$(mktemp -d)
CLEANUP_TEMP=true
if ! git clone --depth 1 "$REPO_URL" "$TEMP_DIR"; then
    echo "clone failed: $REPO_URL" >&2
    exit 1
fi

UNINSTALL_SCRIPT="$TEMP_DIR/uninstall.sh"
[ -f "$UNINSTALL_SCRIPT" ] || {
    echo "uninstall.sh missing in repo" >&2
    exit 1
}
chmod +x "$UNINSTALL_SCRIPT"
PROJECT_DIR="$(cd "$PROJECT_DIR" && pwd)"

UNINSTALL_ARGS=()
if [ "$FORCE" = true ]; then
    UNINSTALL_ARGS+=(--force)
fi
if [ "$NUCLEAR" = true ]; then
    UNINSTALL_ARGS+=(--nuclear)
fi
UNINSTALL_ARGS+=(--project-dir "$PROJECT_DIR")

cd "$TEMP_DIR"
./uninstall.sh "${UNINSTALL_ARGS[@]}"
