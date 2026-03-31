#!/usr/bin/env bash
# Remote install: curl -fsSL https://raw.githubusercontent.com/truongnat/skills/main/install-remote.sh | bash
# Re-run the same command to update (overwrites vendor/own-skills and refreshes skills).
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
CURSOR_ONLY=false
SKILLS_ONLY_REMOTE=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --repo)
            REPO_URL="$2"
            shift 2
            ;;
        --cursor-only)
            CURSOR_ONLY=true
            shift
            ;;
        --skills-only)
            SKILLS_ONLY_REMOTE=true
            shift
            ;;
        --help|-h)
            echo "Usage: curl -fsSL …/install-remote.sh | bash  [ --repo URL ] [ --cursor-only ] [ --skills-only ]"
            exit 0
            ;;
        *)
            echo "Unknown option: $1" >&2
            exit 1
            ;;
    esac
done

command -v git >/dev/null 2>&1 || { echo "git required" >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "python3 required" >&2; exit 1; }

TEMP_DIR=$(mktemp -d)
CLEANUP_TEMP=true
if ! git clone --depth 1 "$REPO_URL" "$TEMP_DIR"; then
    echo "clone failed: $REPO_URL" >&2
    exit 1
fi

INSTALL_SCRIPT="$TEMP_DIR/install.sh"
[ -f "$INSTALL_SCRIPT" ] || {
    echo "install.sh missing in repo" >&2
    exit 1
}
chmod +x "$INSTALL_SCRIPT"

PROJECT_DIR="$(pwd)"
ALL_IDES_ARG=()
[ "$CURSOR_ONLY" = false ] && ALL_IDES_ARG=(--all-ides)
REMOTE_INSTALL_ARGS=(bash "$INSTALL_SCRIPT" . --project-dir "$PROJECT_DIR")
if [ "$SKILLS_ONLY_REMOTE" = true ]; then
    REMOTE_INSTALL_ARGS+=(--skills-only)
else
    REMOTE_INSTALL_ARGS+=(--full)
fi
REMOTE_INSTALL_ARGS+=("${ALL_IDES_ARG[@]}")

"${REMOTE_INSTALL_ARGS[@]}"
