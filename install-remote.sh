#!/usr/bin/env bash
# Remote installer for truongnat/skills
# Usage: curl -fsSL https://raw.githubusercontent.com/truongnat/skills/main/install-remote.sh | bash
# Or: curl -fsSL https://raw.githubusercontent.com/truongnat/skills/main/install-remote.sh | bash -s -- <options>

set -euo pipefail

# Prefer google/zx UI when Node + npx exist (same clone + install.sh; see scripts/install-remote.mjs).
# OWN_SKILLS_INSTALL_REMOTE_MJS: override URL for the zx script (forks / air-gapped mirrors).
_ZX_VER="8.8.5"
_MJS_REMOTE="${OWN_SKILLS_INSTALL_REMOTE_MJS:-https://raw.githubusercontent.com/truongnat/skills/main/scripts/install-remote.mjs}"
if command -v node >/dev/null 2>&1 && command -v npx >/dev/null 2>&1; then
    _TMP="$(mktemp -t own-skills-install.XXXXXX.mjs)"
    _cleanup_mjs() { rm -f "$_TMP"; }
    trap _cleanup_mjs EXIT
    if curl -fsSL "$_MJS_REMOTE" -o "$_TMP"; then
        npx --yes "zx@${_ZX_VER}" "$_TMP" "$@"
        exit $?
    fi
    trap - EXIT
    rm -f "$_TMP"
fi

# Default repository
DEFAULT_REPO="https://github.com/truongnat/skills.git"
TEMP_DIR=""
CLEANUP_TEMP=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to cleanup temp directory on exit
cleanup() {
    if [ "$CLEANUP_TEMP" = true ] && [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
        print_info "Cleaning up temporary directory..."
        rm -rf "$TEMP_DIR"
    fi
}
trap cleanup EXIT

# Parse arguments
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
            echo "Remote installer for truongnat/skills"
            echo ""
            echo "Usage:"
            echo "  curl -fsSL https://raw.githubusercontent.com/truongnat/skills/main/install-remote.sh | bash"
            echo "  curl -fsSL https://raw.githubusercontent.com/truongnat/skills/main/install-remote.sh | bash -s -- --repo https://github.com/other/repo.git"
            echo ""
            echo "Options:"
            echo "  --repo URL       Install from a different repository (default: $DEFAULT_REPO)"
            echo "  --cursor-only    Install only to .cursor/skills (skip Claude Code + Antigravity paths)"
            echo "  --skills-only    Only install skills (no vendor/own-skills bundle; uses copy mode)"
            echo "  --help, -h       Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

print_info "Installing skills from $REPO_URL"

# Check if git is available
print_info "Checking system requirements..."
if ! command -v git &> /dev/null; then
    print_error "Git is required but not installed. Please install git first."
    exit 1
fi

# Check if python3 is available
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is required but not installed. Please install python3 first."
    exit 1
fi
print_success "System requirements met"

# Create temporary directory
print_info "Creating temporary directory..."
TEMP_DIR=$(mktemp -d)
CLEANUP_TEMP=true
print_success "Temporary directory created: $TEMP_DIR"

print_info "Cloning repository..."
if ! git clone --depth 1 "$REPO_URL" "$TEMP_DIR" 2>/dev/null; then
    print_error "Failed to clone repository: $REPO_URL"
    exit 1
fi
print_success "Repository cloned successfully"

# Check if the cloned repo has the install script
print_info "Validating repository structure..."
INSTALL_SCRIPT="$TEMP_DIR/install.sh"
if [ ! -f "$INSTALL_SCRIPT" ]; then
    print_error "Install script not found in repository. This doesn't appear to be a valid skills repository."
    exit 1
fi
print_success "Repository structure validated"

# Make the install script executable
print_info "Preparing installer..."
chmod +x "$INSTALL_SCRIPT"
print_success "Installer prepared"

# Change to the project directory (where this script was run from)
PROJECT_DIR="$(pwd)"
print_info "Installing to project directory: $PROJECT_DIR"

print_info "Running installer (full bundle → vendor/own-skills + skills + IDE links)..."
# Same pattern as rustup/Homebrew: clone once, run project-local installer from the clone.
ALL_IDES_ARG=()
if [ "$CURSOR_ONLY" = false ]; then
    ALL_IDES_ARG=(--all-ides)
fi
chmod +x "$TEMP_DIR/install.sh" 2>/dev/null || true
REMOTE_INSTALL_ARGS=(bash "$TEMP_DIR/install.sh" . --project-dir "$PROJECT_DIR")
if [ "$SKILLS_ONLY_REMOTE" = true ]; then
    REMOTE_INSTALL_ARGS+=(--skills-only)
else
    REMOTE_INSTALL_ARGS+=(--full)
fi
REMOTE_INSTALL_ARGS+=("${ALL_IDES_ARG[@]}")
if "${REMOTE_INSTALL_ARGS[@]}"; then
    print_success "Full bundle and skills installed successfully!"
    print_info "Vendor copy: $PROJECT_DIR/vendor/own-skills/"
    print_info "Skills: $PROJECT_DIR/.cursor/skills/  |  $PROJECT_DIR/.claude/skills/  |  $PROJECT_DIR/.agent/skills/"
else
    print_error "Installation failed. Please check the error messages above."
    exit 1
fi