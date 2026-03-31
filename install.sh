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
SKILL_INPUT="${1:-https://github.com/truongnat/skills.git}"
TEMP_DIR=""
CLEANUP_TEMP=false

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
        echo "Cleaning up temporary directory..."
        rm -rf "$TEMP_DIR"
    fi
}
trap cleanup EXIT

# Detect if input is a remote URL
is_remote_url() {
    local input="$1"
    echo "DEBUG: Checking if '$input' is remote URL"
    # Check for full URLs
    if [[ "$input" =~ ^https?:// ]] || [[ "$input" =~ ^git@ ]]; then
        echo "DEBUG: Detected as full URL"
        return 0
    fi
    # Check for GitHub shorthand (user/repo)
    if [[ "$input" =~ ^[^/]+/[^/]+$ ]] && [[ ! "$input" =~ ^\. ]] && [[ ! -d "$input" ]]; then
        echo "DEBUG: Detected as GitHub shorthand"
        return 0
    fi
    echo "DEBUG: Not detected as remote URL"
    return 1
}

# Resolve skill path - handle remote URLs
resolve_skill_path() {
    local input="$1"
    echo "DEBUG: Resolving skill path for input: '$input'"

    if is_remote_url "$input"; then
        echo "DEBUG: Detected as remote URL"
        # Create temp directory
        TEMP_DIR=$(mktemp -d)
        CLEANUP_TEMP=true

        # Check if it's a GitHub URL for direct download (no git clone needed)
        if [[ "$input" =~ ^https://github\.com/([^/]+)/([^/]+)(\.git)?$ ]]; then
            local user="${BASH_REMATCH[1]}"
            local repo="${BASH_REMATCH[2]}"
            # Remove .git extension if present
            repo="${repo%.git}"
            echo "DEBUG: Matched GitHub URL - user: $user, repo: $repo"
            echo "Detected GitHub repository: $user/$repo"
            echo "Attempting direct download (no git clone needed)..."

            # Try to download SKILL.md directly from repo root
            local raw_url="https://raw.githubusercontent.com/$user/$repo/main/SKILL.md"
            if curl -s -f "$raw_url" -o "$TEMP_DIR/SKILL.md" 2>/dev/null; then
                echo "Found SKILL.md in repository root"
                echo "$TEMP_DIR"
                return
            fi

            # Try to find skills in skills/ directory
            local skills_url="https://api.github.com/repos/$user/$repo/contents/skills"
            echo "Checking skills URL: $skills_url"
            local api_response=$(curl -s "$skills_url")
            if echo "$api_response" | grep -q '"name"'; then
                echo "Repository contains skills directory. Downloading all skills..."
                # Download all skills
                local skills_list=$(echo "$api_response" | grep '"name"' | sed 's/.*"name": "\([^"]*\)".*/\1/')
                echo "Found skills: $skills_list"
                for skill_name in $skills_list; do
                    if [[ "$skill_name" =~ \.md$ ]]; then
                        continue  # Skip markdown files
                    fi
                    local skill_dir="$TEMP_DIR/skills/$skill_name"
                    mkdir -p "$skill_dir"

                    # Download SKILL.md for this skill
                    local skill_md_url="https://raw.githubusercontent.com/$user/$repo/main/skills/$skill_name/SKILL.md"
                    if curl -s -f "$skill_md_url" -o "$skill_dir/SKILL.md" 2>/dev/null; then
                        echo "Downloaded skill: $skill_name"
                    fi

                    # Download references/ directory if it exists
                    local refs_url="https://api.github.com/repos/$user/$repo/contents/skills/$skill_name/references"
                    if curl -s -f "$refs_url" | grep -q '"name"' 2>/dev/null; then
                        mkdir -p "$skill_dir/references"
                        local ref_files=$(curl -s "$refs_url" | grep '"name"' | sed 's/.*"name": "\([^"]*\)".*/\1/')
                        for ref_file in $ref_files; do
                            local ref_url="https://raw.githubusercontent.com/$user/$repo/main/skills/$skill_name/references/$ref_file"
                            curl -s -f "$ref_url" -o "$skill_dir/references/$ref_file" 2>/dev/null || true
                        done
                    fi
                done
                echo "$TEMP_DIR"
                return
            fi

            echo "Error: Could not find SKILL.md or skills/ directory in repository" >&2
            exit 1
        fi

        # Convert GitHub shorthand to full URL
        if [[ "$input" =~ ^[^/]+/[^/]+$ ]]; then
            input="https://github.com/$input.git"
        fi

        echo "Falling back to git clone for: $input"
        if ! git clone --depth 1 "$input" "$TEMP_DIR" 2>/dev/null; then
            echo "Error: Failed to clone repository from $input" >&2
            exit 1
        fi

        # If it's a full repo, look for skills directory
        if [ -d "$TEMP_DIR/skills" ]; then
            # Check if this is the default repo (truongnat/skills) or --remote flag was used
            if [[ "$input" =~ truongnat/skills ]] || [ "$REMOTE_MODE" = true ]; then
                echo "Installing all skills from repository..."
                # Install all skills from the skills directory
                for skill_dir in "$TEMP_DIR/skills"/*/; do
                    if [ -d "$skill_dir" ] && [ -f "$skill_dir/SKILL.md" ]; then
                        skill_name=$(basename "$skill_dir")
                        echo "Installing skill: $skill_name"
                        python3 "$SCRIPT_DIR/scripts/install_skill.py" "$skill_dir" --project-dir "$PROJECT_DIR" --mode symlink --force
                    fi
                done
                echo "All skills installed successfully!"
                exit 0
            else
                echo "Repository contains skills directory. Please specify which skill to install:" >&2
                ls -1 "$TEMP_DIR/skills" | sed 's/^/  - /' >&2
                echo "Usage: ./install.sh <skill-name> (from the skills/ directory)" >&2
                echo "Or use: ./install.sh --remote <repo-url> to install all skills" >&2
                exit 1
            fi
        fi

        echo "$TEMP_DIR"
    else
        # Local path
        if [ "$input" = "." ]; then
            echo "$input"
        elif [ -d "$input" ]; then
            echo "$input"
        else
            echo "Error: Local path '$input' does not exist or is not a directory." >&2
            exit 1
        fi
    fi
}

if [ ! -d "$SCRIPT_DIR/scripts" ]; then
  echo "Error: this script must be run from the repository root where scripts/install_skill.py exists." >&2
  exit 1
fi

SKILL_PATH=$(resolve_skill_path "$SKILL_INPUT")

echo "Installing skill from '$SKILL_INPUT' into project '$PROJECT_DIR'..."

python3 "$SCRIPT_DIR/scripts/install_skill.py" "$SKILL_PATH" --project-dir "$PROJECT_DIR" --mode symlink --force

