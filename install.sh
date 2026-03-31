#!/usr/bin/env bash
# One-command installer for own-skills. Usage:
#   ./install.sh . --project-dir /path/to/target --full
#   ./install.sh https://github.com/user/repo.git --project-dir /path/to/target
# Full install (default for remote URL): copies repo to <project>/vendor/own-skills, links Cursor rules,
# then installs all skills (symlinks from vendor — stable paths).
# Skills-only: add --skills-only (remote uses copy mode so temp dirs can be deleted safely).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(pwd)"
REMOTE_MODE=false
REMOTE_URL=""
ALL_IDES=false
SKILLS_ONLY=false
FULL_INSTALL=false
SKILL_INPUT=""
TEMP_DIR=""
CLEANUP_TEMP=false
INSTALL_EXTRA=()

# Inner step: only install skills from an already-vendored tree (no bundle copy).
OWN_SKILLS_INNER="${OWN_SKILLS_INNER:-0}"

show_progress() {
    local current=$1
    local total=$2
    local width=50
    local percentage=$((current * 100 / total))
    local completed=$((current * width / total))
    printf "\rProgress: [%-${width}s] %d%% (%d/%d)" "$(printf '█%.0s' $(seq 1 $completed))" "$percentage" "$current" "$total"
}

complete_progress() {
    local total=$1
    show_progress "$total" "$total"
    echo ""
}

show_status() {
    echo "ℹ️  $1"
}

show_success() {
    echo "✅ $1"
}

show_error() {
    echo "❌ $1" >&2
}

# Copy repo tree into vendor/own-skills (stable paths for symlinks; excludes heavy/ephemeral dirs).
sync_to_vendor() {
    local src="$1"
    local dest="$2"
    rm -rf "$dest"
    mkdir -p "$(dirname "$dest")"
    mkdir -p "$dest"
    (cd "$src" && tar -cf - \
        --exclude=.git \
        --exclude=.venv \
        --exclude='knowledge-base/embeddings' \
        --exclude=__pycache__ \
        --exclude='*.pyc' \
        --exclude=.DS_Store \
        .) | (cd "$dest" && tar -xf -)
    touch "$dest/.own-skills-bundle"
}

# Symlink Cursor rules from bundle into project .cursor/rules (same filenames).
link_cursor_rules() {
    local vendor="$1"
    local proj="$2"
    local rules_src="$vendor/.cursor/rules"
    if [ ! -d "$rules_src" ]; then
        return 0
    fi
    mkdir -p "$proj/.cursor/rules"
    local f
    for f in "$rules_src"/*.mdc; do
        [ -f "$f" ] || continue
        ln -sfn "$(cd "$(dirname "$f")" && pwd)/$(basename "$f")" "$proj/.cursor/rules/$(basename "$f")"
    done
}

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
        --all-ides)
            ALL_IDES=true
            shift
            ;;
        --full)
            FULL_INSTALL=true
            shift
            ;;
        --skills-only)
            SKILLS_ONLY=true
            FULL_INSTALL=false
            shift
            ;;
        --help|-h)
            echo "own-skills installer"
            echo ""
            echo "Usage:"
            echo "  ./install.sh [<skill-path>] [--project-dir <dir>] [--all-ides] [--full|--skills-only]"
            echo "  ./install.sh --remote <repo-url> [--project-dir <dir>]"
            echo ""
            echo "Full bundle (workflows, scripts, knowledge-base, prompts, templates, skills, rules link):"
            echo "  ./install.sh . --project-dir <target> --full"
            echo "  Remote URL defaults to full bundle unless --skills-only."
            echo ""
            echo "Options:"
            echo "  --full           Copy this repo to <project>/vendor/own-skills, link .cursor/rules, install skills"
            echo "  --skills-only    Only install skills (remote: copy mode; avoids broken symlinks from temp clone)"
            echo "  --all-ides       Also .claude/skills and .agent/skills"
            echo "  --project-dir    Target project root (default: current directory)"
            exit 0
            ;;
        *)
            SKILL_INPUT="$1"
            shift
            ;;
    esac
done

if [ "$REMOTE_MODE" = true ]; then
    SKILL_INPUT="$REMOTE_URL"
fi

if [ -z "$SKILL_INPUT" ] && [ -d "$SCRIPT_DIR/skills" ] && [ "$OWN_SKILLS_INNER" != "1" ]; then
    SKILL_INPUT="."
fi
if [ -z "$SKILL_INPUT" ]; then
    SKILL_INPUT="https://github.com/truongnat/skills.git"
fi

if [ "$ALL_IDES" = true ]; then
    INSTALL_EXTRA+=(--all-ides)
fi

is_remote_url() {
    local input="$1"
    if [[ "$input" =~ ^https?:// ]] || [[ "$input" =~ ^git@ ]]; then
        return 0
    fi
    if [[ "$input" =~ ^[^/]+/[^/]+$ ]] && [[ ! "$input" =~ ^\. ]] && [[ ! -d "$input" ]]; then
        return 0
    fi
    return 1
}

# Remote URL defaults to full bundle unless --skills-only.
if is_remote_url "$SKILL_INPUT" && [ "$SKILLS_ONLY" = false ]; then
    FULL_INSTALL=true
fi

cleanup() {
    if [ "$CLEANUP_TEMP" = true ] && [ -n "${TEMP_DIR:-}" ] && [ -d "${TEMP_DIR:-}" ]; then
        show_status "Cleaning up temporary directory..."
        rm -rf "$TEMP_DIR"
        show_success "Cleanup completed"
    fi
}
trap cleanup EXIT

if [ ! -d "$SCRIPT_DIR/scripts" ]; then
    show_error "This script must be run from the repository root where scripts/install_skill.py exists."
    exit 1
fi

# Expand GitHub shorthand to HTTPS clone URL
if is_remote_url "$SKILL_INPUT" && [[ "$SKILL_INPUT" =~ ^[^/]+/[^/]+$ ]] && [[ ! -d "$SKILL_INPUT" ]]; then
    SKILL_INPUT="https://github.com/${SKILL_INPUT}.git"
fi

install_all_skills_from_dir() {
    local skill_root="$1"
    local mode="$2"
    local skill_dirs=()
    shopt -s nullglob
    skill_dirs=("$skill_root"/*/)
    shopt -u nullglob
    local valid_skills=()
    local skill_dir
    for skill_dir in "${skill_dirs[@]}"; do
        if [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
            valid_skills+=("$skill_dir")
        fi
    done
    local total_skills=${#valid_skills[@]}
    if [ "$total_skills" -eq 0 ]; then
        show_error "No valid skills under $skill_root"
        return 1
    fi
    show_status "Found $total_skills skills to install"

    local installed_count=0
    local skill_name
    for skill_dir in "${valid_skills[@]}"; do
        skill_name=$(basename "$skill_dir")
        ((installed_count++)) || true
        show_progress "$installed_count" "$total_skills"
        show_status "Installing: $skill_name"

        _py=(python3 "$SCRIPT_DIR/scripts/install_skill.py" "$skill_dir" --project-dir "$PROJECT_DIR" --mode "$mode" --force)
        if [ ${#INSTALL_EXTRA[@]} -gt 0 ]; then
            _py+=("${INSTALL_EXTRA[@]}")
        fi
        if "${_py[@]}" >/dev/null 2>&1; then
            show_success "✓ $skill_name"
        else
            show_error "✗ $skill_name"
        fi
    done
    complete_progress "$total_skills"
    show_success "All skills installed successfully!"
    return 0
}

# --- Inner: only skills (from vendor/own-skills), no bundle copy ---
if [ "$OWN_SKILLS_INNER" = "1" ]; then
    if [ ! -d "$SCRIPT_DIR/skills" ]; then
        show_error "No skills/ directory in $SCRIPT_DIR"
        exit 1
    fi
    show_status "Installing skills from bundle (inner step)..."
    install_all_skills_from_dir "$SCRIPT_DIR/skills" symlink
    exit 0
fi

# --- Local full bundle: copy repo to vendor, link rules, re-exec inner ---
if [ "$SKILL_INPUT" = "." ] && [ -d "$SCRIPT_DIR/skills" ] && [ "$FULL_INSTALL" = true ]; then
    VENDOR="$PROJECT_DIR/vendor/own-skills"
    show_status "Full bundle: copying repository to $VENDOR ..."
    sync_to_vendor "$SCRIPT_DIR" "$VENDOR"
    link_cursor_rules "$VENDOR" "$PROJECT_DIR"
    show_success "Bundle installed. Linking skills into IDE paths..."
    export OWN_SKILLS_INNER=1
    if [ ${#INSTALL_EXTRA[@]} -gt 0 ]; then
        exec /bin/bash "$VENDOR/install.sh" . --project-dir "$PROJECT_DIR" "${INSTALL_EXTRA[@]}"
    else
        exec /bin/bash "$VENDOR/install.sh" . --project-dir "$PROJECT_DIR"
    fi
fi

# --- Remote: clone, optionally full bundle ---
if is_remote_url "$SKILL_INPUT"; then
    show_status "Detected remote repository: $SKILL_INPUT"
    TEMP_DIR=$(mktemp -d)
    CLEANUP_TEMP=true
    show_status "Cloning repository..."
    if ! git clone --depth 1 "$SKILL_INPUT" "$TEMP_DIR" 2>/dev/null; then
        show_error "git clone failed"
        exit 1
    fi
    show_success "Repository cloned"

    if [ "$FULL_INSTALL" = true ]; then
        VENDOR="$PROJECT_DIR/vendor/own-skills"
        show_status "Full bundle: copying to $VENDOR ..."
        sync_to_vendor "$TEMP_DIR" "$VENDOR"
        link_cursor_rules "$VENDOR" "$PROJECT_DIR"
        rm -rf "$TEMP_DIR"
        CLEANUP_TEMP=false
        TEMP_DIR=""
        show_success "Starting skill install from vendor tree..."
        export OWN_SKILLS_INNER=1
        if [ ${#INSTALL_EXTRA[@]} -gt 0 ]; then
            exec /bin/bash "$VENDOR/install.sh" . --project-dir "$PROJECT_DIR" "${INSTALL_EXTRA[@]}"
        else
            exec /bin/bash "$VENDOR/install.sh" . --project-dir "$PROJECT_DIR"
        fi
    fi

    SKILL_PATH="$TEMP_DIR"
    if [ ! -d "$SKILL_PATH/skills" ]; then
        show_error "No skills/ directory in cloned repository."
        exit 1
    fi
    show_status "Skills-only install (copy mode)..."
    install_all_skills_from_dir "$SKILL_PATH/skills" copy
    exit 0
fi

# --- Local: skills only (no --full) ---
SKILL_PATH="$SKILL_INPUT"
if [ "$SKILL_PATH" = "." ] && [ -d "skills" ]; then
    show_status "Installing all local skills..."
    install_all_skills_from_dir "skills" symlink
    exit 0
fi

# Single skill path
show_status "Installing skill from '$SKILL_INPUT' into project '$PROJECT_DIR'..."
_py=(python3 "$SCRIPT_DIR/scripts/install_skill.py" "$SKILL_PATH" --project-dir "$PROJECT_DIR" --mode symlink --force)
if [ ${#INSTALL_EXTRA[@]} -gt 0 ]; then
    _py+=("${INSTALL_EXTRA[@]}")
fi
if "${_py[@]}"; then
    show_success "Installation completed successfully!"
else
    show_error "Installation failed. Please check the error messages above."
    exit 1
fi
