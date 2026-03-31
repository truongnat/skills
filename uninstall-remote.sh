#!/usr/bin/env bash
# Remote uninstaller for truongnat/skills
# Usage: curl -fsSL https://raw.githubusercontent.com/truongnat/skills/main/uninstall-remote.sh | bash
# Or: curl -fsSL https://raw.githubusercontent.com/truongnat/skills/main/uninstall-remote.sh | bash -s -- <options>

set -euo pipefail

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
FORCE=false
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
        --project-dir)
            PROJECT_DIR="$2"
            shift 2
            ;;
        --help|-h)
            echo "Remote uninstaller for truongnat/skills"
            echo ""
            echo "Usage:"
            echo "  curl -fsSL https://raw.githubusercontent.com/truongnat/skills/main/uninstall-remote.sh | bash"
            echo "  curl -fsSL https://raw.githubusercontent.com/truongnat/skills/main/uninstall-remote.sh | bash -s -- --force"
            echo ""
            echo "Options:"
            echo "  --repo URL        Uninstall skills from a different repository (default: $DEFAULT_REPO)"
            echo "  --project-dir DIR Uninstall from specified project directory (default: current directory)"
            echo "  --force           Force removal without confirmation"
            echo "  --help, -h        Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

print_info "Uninstalling skills from $REPO_URL"

# Check if git is available
print_info "Checking system requirements..."
if ! command -v git &> /dev/null; then
    print_error "Git is required but not installed. Please install git first."
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

# Check if the cloned repo has the uninstall script
print_info "Validating repository structure..."
UNINSTALL_SCRIPT="$TEMP_DIR/uninstall.sh"
if [ ! -f "$UNINSTALL_SCRIPT" ]; then
    print_error "Uninstall script not found in repository. This doesn't appear to be a valid skills repository."
    exit 1
fi
print_success "Repository structure validated"

# Make the uninstall script executable
print_info "Preparing uninstaller..."
chmod +x "$UNINSTALL_SCRIPT"
print_success "Uninstaller prepared"

# Convert project directory to absolute path
PROJECT_DIR="$(cd "$PROJECT_DIR" && pwd)"
print_info "Uninstalling from project directory: $PROJECT_DIR"

print_info "Running uninstaller..."
cd "$TEMP_DIR"

# Prepare uninstall arguments
UNINSTALL_ARGS=()
if [ "$FORCE" = true ]; then
    UNINSTALL_ARGS+=(--force)
fi
UNINSTALL_ARGS+=(--project-dir "$PROJECT_DIR")

# Run the uninstall script
if ./uninstall.sh "${UNINSTALL_ARGS[@]}"; then
    print_success "All skills uninstalled successfully!"
    print_info "Project $PROJECT_DIR has been cleaned of all skills installations."
else
    print_error "Uninstallation failed. Please check the error messages above."
    exit 1
fi