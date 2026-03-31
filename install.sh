#!/usr/bin/env bash
# One-command installer for own-skills. Usage:
#   ./install.sh [<skill-path>] [--remote <repo-url>]
#   ./install.sh --remote <repo-url>  # Install all skills from remote repo
# <skill-path> can be:
#   - Local path (relative/absolute to skill directory)
#   - Remote URL (https://github.com/user/repo.git or git@github.com:user/repo.git)
#   - GitHub shorthand (user/repo for github.com/user/repo)
# If <skill-path> is omitted, installs all skills from https://github.com/truongnat/skills
# The project destination is always the current working directory where this script is executed.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(pwd)"
REMOTE_MODE=false
REMOTE_URL=""
SKILL_INPUT="${1:-}"
# If no argument provided and we're in a skills repo, install all local skills
if [ -z "$SKILL_INPUT" ] && [ -d "skills" ]; then
    SKILL_INPUT="."
fi
# Default to remote repo if still empty
SKILL_INPUT="${SKILL_INPUT:-https://github.com/truongnat/skills.git}"
TEMP_DIR=""
CLEANUP_TEMP=false

# Progress bar function
show_progress() {
    local current=$1
    local total=$2
    local width=50
    local percentage=$((current * 100 / total))
    local completed=$((current * width / total))

    printf "\rProgress: [%-${width}s] %d%% (%d/%d)" "$(printf '█%.0s' $(seq 1 $completed))" "$percentage" "$current" "$total"
}

# Complete progress bar
complete_progress() {
    local total=$1
    show_progress "$total" "$total"
    echo ""  # New line after progress bar
}

# Show status message with timestamp
show_status() {
    local message="$1"
    echo "ℹ️  $message"
}

# Show success message
show_success() {
    local message="$1"
    echo "✅ $message"
}

# Show error message
show_error() {
    local message="$1"
    echo "❌ $message" >&2
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --remote)
            REMOTE_MODE=true
            REMOTE_URL="$2"
            shift 2
            ;;
        --project-dir)
            PROJECT_DIR="$2"
            shift 2
            ;;
        --help|-h)
            echo "One-command installer for own-skills"
            echo ""
            echo "Usage:"
            echo "  ./install.sh [<skill-path>] [--project-dir <dir>]"
            echo "  ./install.sh --remote <repo-url> [--project-dir <dir>]"
            echo ""
            echo "<skill-path> can be:"
            echo "  - Local path (relative/absolute to skill directory)"
            echo "  - Remote URL (https://github.com/user/repo.git or git@github.com:user/repo.git)"
            echo "  - GitHub shorthand (user/repo for github.com/user/repo)"
            echo ""
            echo "If <skill-path> is omitted, installs all skills from https://github.com/truongnat/skills"
            echo "The project destination is always the current working directory where this script is executed."
            echo ""
            echo "Options:"
            echo "  --remote <url>     Install all skills from remote repository"
            echo "  --project-dir <dir> Install to specified project directory (default: current directory)"
            echo "  --help, -h         Show this help message"
            exit 0
            ;;
        *)
            SKILL_INPUT="$1"
            shift
            ;;
    esac
done

# If --remote flag is used, override SKILL_INPUT
if [ "$REMOTE_MODE" = true ]; then
    SKILL_INPUT="$REMOTE_URL"
fi

# Function to cleanup temp directory on exit
cleanup() {
    if [ "$CLEANUP_TEMP" = true ] && [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
        show_status "Cleaning up temporary directory..."
        rm -rf "$TEMP_DIR"
        show_success "Cleanup completed"
    fi
}
trap cleanup EXIT

# Detect if input is a remote URL
is_remote_url() {
    local input="$1"
    if [[ "$input" =~ ^https?:// ]] || [[ "$input" =~ ^git@ ]]; then
        return 0
    fi
    # Check for GitHub shorthand (user/repo)
    if [[ "$input" =~ ^[^/]+/[^/]+$ ]] && [[ ! "$input" =~ ^\. ]] && [[ ! -d "$input" ]]; then
        return 0
    fi
    return 1
}

if [ ! -d "$SCRIPT_DIR/scripts" ]; then
  show_error "This script must be run from the repository root where scripts/install_skill.py exists."
  exit 1
fi

# Handle remote installation separately
if is_remote_url "$SKILL_INPUT"; then
    show_status "Detected remote repository: $SKILL_INPUT"
    TEMP_DIR=$(mktemp -d)
    CLEANUP_TEMP=true
    show_status "Created temporary directory"

    # For GitHub URLs, try direct download first
    if [[ "$SKILL_INPUT" =~ ^https://github\.com/([^/]+)/([^/]+)(\.git)?$ ]]; then
        user="${BASH_REMATCH[1]}"
        repo="${BASH_REMATCH[2]}"
        repo="${repo%.git}"
        show_status "Attempting direct download from GitHub..."

        skills_url="https://api.github.com/repos/$user/$repo/contents/skills"
        api_response=$(curl -s "$skills_url" 2>/dev/null)
        if echo "$api_response" | grep -q '"name"'; then
            show_status "Repository contains skills. Downloading..."
            skills_list=$(echo "$api_response" | grep '"name"' | sed 's/.*"name": "\([^"]*\)".*/\1/')
            total_skills=$(echo "$skills_list" | wc -w)
            show_status "Found $total_skills skills to download"

            skill_count=0
            for skill_name in $skills_list; do
                if [[ "$skill_name" =~ \.md$ ]]; then
                    continue
                fi
                ((skill_count++))
                show_progress "$skill_count" "$total_skills"

                skill_dir="$TEMP_DIR/skills/$skill_name"
                mkdir -p "$skill_dir"
                skill_url="https://raw.githubusercontent.com/$user/$repo/main/skills/$skill_name/SKILL.md"
                curl -s -f "$skill_url" -o "$skill_dir/SKILL.md" 2>/dev/null || true
            done
            complete_progress "$total_skills"
            SKILL_PATH="$TEMP_DIR"
        else
            show_status "Falling back to git clone..."
            if git clone --depth 1 "$SKILL_INPUT" "$TEMP_DIR" 2>/dev/null; then
                show_success "Repository cloned"
                SKILL_PATH="$TEMP_DIR"
            else
                show_error "Failed to clone repository"
                exit 1
            fi
        fi
    else
        # Non-GitHub remote
        if git clone --depth 1 "$SKILL_INPUT" "$TEMP_DIR" 2>/dev/null; then
            show_success "Repository cloned"
            SKILL_PATH="$TEMP_DIR"
        else
            show_error "Failed to clone repository"
            exit 1
        fi
    fi

    # Check if this is a skills repo that should install all
    if [ -d "$SKILL_PATH/skills" ] && { [[ "$SKILL_INPUT" =~ truongnat/skills ]] || [ "$REMOTE_MODE" = true ]; }; then
        show_status "Installing all skills from repository..."
        skill_dirs=("$SKILL_PATH/skills"/*/)
        valid_skills=()
        for skill_dir in "${skill_dirs[@]}"; do
            if [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
                valid_skills+=("$skill_dir")
            fi
        done
        total_skills=${#valid_skills[@]}
        show_status "Found $total_skills skills to install"

        installed_count=0
        for skill_dir in "${valid_skills[@]}"; do
            skill_name=$(basename "$skill_dir")
            ((installed_count++))
            show_progress "$installed_count" "$total_skills"
            show_status "Installing: $skill_name"

            if python3 "$SCRIPT_DIR/scripts/install_skill.py" "$skill_dir" --project-dir "$PROJECT_DIR" --mode symlink --force >/dev/null 2>&1; then
                show_success "✓ $skill_name"
            else
                show_error "✗ $skill_name"
            fi
        done
        complete_progress "$total_skills"
        show_success "All skills installed successfully!"
        exit 0
    fi
else
    # Local installation
    SKILL_PATH="$SKILL_INPUT"
    if [ "$SKILL_PATH" = "." ] && [ -d "skills" ]; then
        # Install all local skills
        show_status "Installing all local skills..."
        skill_dirs=("skills"/*/)
        valid_skills=()
        for skill_dir in "${skill_dirs[@]}"; do
            if [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
                valid_skills+=("$skill_dir")
            fi
        done
        total_skills=${#valid_skills[@]}
        show_status "Found $total_skills skills to install"

        installed_count=0
        for skill_dir in "${valid_skills[@]}"; do
            skill_name=$(basename "$skill_dir")
            ((installed_count++))
            show_progress "$installed_count" "$total_skills"
            show_status "Installing: $skill_name"

            if python3 "$SCRIPT_DIR/scripts/install_skill.py" "$skill_dir" --project-dir "$PROJECT_DIR" --mode symlink --force >/dev/null 2>&1; then
                show_success "✓ $skill_name"
            else
                show_error "✗ $skill_name"
            fi
        done
        complete_progress "$total_skills"
        show_success "All skills installed successfully!"
        exit 0
    fi
fi

# Single skill installation
show_status "Installing skill from '$SKILL_INPUT' into project '$PROJECT_DIR'..."
if python3 "$SCRIPT_DIR/scripts/install_skill.py" "$SKILL_PATH" --project-dir "$PROJECT_DIR" --mode symlink --force; then
    show_success "Installation completed successfully!"
else
    show_error "Installation failed. Please check the error messages above."
    exit 1
fi

