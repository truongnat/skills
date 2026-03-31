#!/usr/bin/env bash
# One-command uninstaller for own-skills. Usage:
#   ./uninstall.sh [--project-dir <dir>] [--force]
# Removes all skills installed by this project from the target project directory.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(pwd)"
FORCE=false
NUCLEAR=false

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
        --project-dir)
            PROJECT_DIR="$2"
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
        --help|-h)
            echo "One-command uninstaller for own-skills"
            echo ""
            echo "Usage:"
            echo "  ./uninstall.sh [--project-dir <dir>] [--force] [--nuclear]"
            echo ""
            echo "Removes all skills installed by this project from the target project directory."
            echo ""
            echo "Options:"
            echo "  --project-dir <dir>  Uninstall from specified project directory (default: current directory)"
            echo "  --force              Force removal without confirmation"
            echo "  --nuclear            Remove entire .cursor directory (⚠️  DANGER: removes all Cursor config)"
            echo "  --help, -h           Show this help message"
            exit 0
            ;;
        *)
            show_error "Unknown option: $1"
            echo "Use --help for usage information."
            exit 1
            ;;
    esac
done

# Convert to absolute path
PROJECT_DIR="$(cd "$PROJECT_DIR" && pwd)"
CURSOR_DIR="$PROJECT_DIR/.cursor"
CURSOR_SKILLS_DIR="$CURSOR_DIR/skills"

show_status "Uninstalling skills from project: $PROJECT_DIR"

# Check if .cursor/skills exists
if [ ! -d "$CURSOR_SKILLS_DIR" ]; then
    show_status "No skills directory found at $CURSOR_SKILLS_DIR"
    # Proceed to .cursor cleanup instead of exiting
    INSTALLED_SKILLS=()
else
    # Get list of installed skills (excluding .install-manifest)
    INSTALLED_SKILLS=()
    while IFS= read -r -d '' skill_dir; do
        skill_name=$(basename "$skill_dir")
        if [ "$skill_name" != ".install-manifest" ]; then
            INSTALLED_SKILLS+=("$skill_name")
        fi
    done < <(find "$CURSOR_SKILLS_DIR" -mindepth 1 -maxdepth 1 -type d -print0 2>/dev/null)

    # Also check for symlinks
    while IFS= read -r -d '' skill_link; do
        skill_name=$(basename "$skill_link")
        if [ "$skill_name" != ".install-manifest" ]; then
            INSTALLED_SKILLS+=("$skill_name")
        fi
    done < <(find "$CURSOR_SKILLS_DIR" -mindepth 1 -maxdepth 1 -type l -print0 2>/dev/null)
fi

# Remove duplicates
if [ ${#INSTALLED_SKILLS[@]} -gt 0 ]; then
    INSTALLED_SKILLS=($(printf "%s\n" "${INSTALLED_SKILLS[@]}" | sort -u))
fi

TOTAL_SKILLS=${#INSTALLED_SKILLS[@]}

if [ $TOTAL_SKILLS -gt 0 ]; then
    show_status "Found $TOTAL_SKILLS skills to uninstall"

    # Confirm uninstallation unless --force is used
    if [ "$FORCE" = false ]; then
        echo ""
        echo "⚠️  This will remove the following skills from $PROJECT_DIR:"
        for skill in "${INSTALLED_SKILLS[@]}"; do
            echo "   - $skill"
        done
        if [ "$NUCLEAR" = true ]; then
            echo ""
            echo "⚠️  NUCLEAR MODE: This will also remove the ENTIRE .cursor directory!"
            echo "   This includes all Cursor configuration files and rules."
        fi
        echo ""
        read -p "Are you sure you want to continue? (y/N): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            show_status "Uninstallation cancelled."
            exit 0
        fi
    fi

    # Remove skills with progress
    removed_count=0
    for skill_name in "${INSTALLED_SKILLS[@]}"; do
        ((removed_count++))
        show_progress "$removed_count" "$TOTAL_SKILLS"
        show_status "Removing: $skill_name"

        skill_path="$CURSOR_SKILLS_DIR/$skill_name"

        # Remove the skill directory/link
        if [ -L "$skill_path" ] || [ -d "$skill_path" ] || [ -f "$skill_path" ]; then
            rm -rf "$skill_path"
            show_success "✓ Removed $skill_name"
        else
            show_error "✗ Could not find $skill_name to remove"
        fi

        # Remove from git exclude if it exists
        git_exclude_file="$PROJECT_DIR/.git/info/exclude"
        if [ -f "$git_exclude_file" ]; then
            # Remove the line for this skill
            sed -i.bak "/^\.cursor\/skills\/$skill_name\/$/d" "$git_exclude_file" 2>/dev/null || true
            # Clean up backup file
            rm -f "$git_exclude_file.bak" 2>/dev/null || true
        fi
    done

    complete_progress "$TOTAL_SKILLS"
else
    if [ "$NUCLEAR" = false ]; then
        show_success "No installed skills found to remove."
    fi
fi

# Remove manifest directory if it exists and is empty
MANIFEST_DIR="$CURSOR_SKILLS_DIR/.install-manifest"
if [ -d "$MANIFEST_DIR" ]; then
    show_status "Removing installation manifests..."
    rm -rf "$MANIFEST_DIR"
    show_success "Manifests removed"
fi

# Cleanup empty directories
if [ -d "$CURSOR_DIR" ] && [ "$NUCLEAR" = false ]; then
    show_status "Cleaning up empty directories..."
    # Try to remove .DS_Store files in .cursor to help cleanup
    find "$CURSOR_DIR" -name ".DS_Store" -type f -delete 2>/dev/null || true
    # Remove empty directories recursively (skills, then .cursor if empty)
    find "$CURSOR_DIR" -type d -empty -delete 2>/dev/null || true
    
    if [ ! -d "$CURSOR_DIR" ]; then
        show_success ".cursor directory cleaned up"
    else
        show_status ".cursor directory still contains other files, keeping it."
    fi
elif [ -d "$CURSOR_DIR" ] && [ "$NUCLEAR" = true ]; then
    show_status "Nuclear cleanup: Removing entire .cursor directory..."
    rm -rf "$CURSOR_DIR"
    show_success "Entire .cursor directory removed"
fi

show_success "All skills uninstalled successfully!"
show_status "Project has been cleaned of all own-skills installations."