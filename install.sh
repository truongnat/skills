#!/usr/bin/env bash
set -euo pipefail

OWNER="${SIMPLE_SKILLS_OWNER:-truongnat}"
REPO="${SIMPLE_SKILLS_REPO:-simple-skills}"
BRANCH="${SIMPLE_SKILLS_BRANCH:-main}"
GITHUB="${OWNER}/${REPO}"
AGENTS_MODE="${SIMPLE_SKILLS_AGENTS_MODE:-prompt}"

TARGET="$(pwd)"
SOURCE=""
TMP=""

usage() {
  cat <<'EOF'
Usage: install.sh [--agents-mode prompt|replace|skip]

Controls how an existing root AGENTS.md is handled:
  prompt   Ask before replacing it (default; skips when non-interactive)
  replace  Replace it without prompting
  skip     Keep it unchanged
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --agents-mode)
      [ "$#" -ge 2 ] || { echo "Error: --agents-mode requires a value." >&2; exit 2; }
      AGENTS_MODE="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Error: unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

case "$AGENTS_MODE" in
  prompt|replace|skip) ;;
  *)
    echo "Error: agents mode must be prompt, replace, or skip." >&2
    exit 2
    ;;
esac

cleanup() {
  if [ -n "$TMP" ] && [ -d "$TMP" ]; then
    rm -rf "$TMP"
  fi
}
trap cleanup EXIT

fetch_source() {
  echo "Downloading ${GITHUB}@${BRANCH} ..."
  TMP="$(mktemp -d)"
  curl -fsSL "https://github.com/${GITHUB}/archive/refs/heads/${BRANCH}.tar.gz" \
    | tar -xz -C "$TMP" --strip-components=1
  SOURCE="$TMP"
}

# Detect the simple-skills repo itself — not any project that happens to have a skills/ dir.
is_simple_skills_source() {
  local root="$1"
  [ -f "${root}/docs/AGENTS.md" ] \
    && [ -f "${root}/skills/planning/SKILL.md" ] \
    && [ -f "${root}/skills/execution/SKILL.md" ]
}

if is_simple_skills_source "$(pwd)"; then
  SOURCE="$(pwd)"
else
  fetch_source
fi

echo "Installing skills into ${TARGET}/.agents ..."

mkdir -p "${TARGET}/.agents/skills"

skill_count=0
for skill_path in "${SOURCE}"/skills/*/; do
  [ -d "$skill_path" ] || continue
  skill_count=$((skill_count + 1))
done

echo "Found ${skill_count} skills."

for skill_path in "${SOURCE}"/skills/*/; do
  [ -d "$skill_path" ] || continue
  skill="$(basename "$skill_path")"
  echo "Installing skill ${skill} ..."
  skill_dest="${TARGET}/.agents/skills/${skill}"
  mkdir -p "$skill_dest"
  shopt -s dotglob nullglob
  # Mirror managed skill content so removed/renamed files do not remain stale.
  # Preserve only the skill-local virtual environment.
  for item in "${skill_dest}"/*; do
    [ "$(basename "$item")" = ".venv" ] && continue
    rm -rf "$item"
  done
  for item in "${skill_path}"*; do
    [ "$(basename "$item")" = ".venv" ] && continue
    cp -R "$item" "${skill_dest}/"
  done
  shopt -u dotglob nullglob
done

# Remove obsolete Office MCP skill left behind by earlier installs.
if [ -d "${TARGET}/.agents/skills/office-mcp" ]; then
  echo "Removing obsolete skill office-mcp ..."
  rm -rf "${TARGET}/.agents/skills/office-mcp"
fi

cp -f "${SOURCE}/docs/DESIGN_SYSTEM.md" "${TARGET}/.agents/DESIGN_SYSTEM.md"
cp -f "${SOURCE}/docs/THIRD_PARTY_SKILLS.md" "${TARGET}/.agents/THIRD_PARTY_SKILLS.md"

# Install local agent tools (HTML decision server, etc.).
if [ -d "${SOURCE}/tools" ]; then
  echo "Installing tools into ${TARGET}/.agents/tools ..."
  mkdir -p "${TARGET}/.agents/tools"
  shopt -s dotglob nullglob
  for item in "${TARGET}/.agents/tools"/*; do
    # Preserve runtime logs if a previous install left them here.
    [ "$(basename "$item")" = "decision-logs" ] && continue
    rm -rf "$item"
  done
  for item in "${SOURCE}/tools"/*; do
    [ "$(basename "$item")" = "decision-logs" ] && continue
    cp -R "$item" "${TARGET}/.agents/tools/"
  done
  shopt -u dotglob nullglob
fi

# Preserve the user's existing settings (e.g. language choice) on reinstall.
if [ -f "${TARGET}/.agents/settings.yaml" ]; then
  echo "Keeping existing .agents/settings.yaml."
else
  cp -f "${SOURCE}/docs/settings.yaml" "${TARGET}/.agents/settings.yaml"
fi

install_agents_file=true
if [ -f "${TARGET}/AGENTS.md" ]; then
  case "$AGENTS_MODE" in
    replace)
      echo "Replacing existing ${TARGET}/AGENTS.md ..."
      ;;
    skip)
      echo "Keeping existing ${TARGET}/AGENTS.md."
      install_agents_file=false
      ;;
    prompt)
      if [ -c /dev/tty ] && tty -s < /dev/tty 2>/dev/null; then
        printf "AGENTS.md already exists. Replace it? [y/N] " > /dev/tty
        read -r answer < /dev/tty
        case "$answer" in
          y|Y|yes|YES|Yes)
            echo "Replacing existing ${TARGET}/AGENTS.md ..."
            ;;
          *)
            echo "Keeping existing ${TARGET}/AGENTS.md."
            install_agents_file=false
            ;;
        esac
      else
        echo "AGENTS.md already exists; keeping it because no interactive terminal is available." >&2
        echo "Use --agents-mode replace or SIMPLE_SKILLS_AGENTS_MODE=replace to replace it." >&2
        install_agents_file=false
      fi
      ;;
  esac
fi

if [ "$install_agents_file" = true ]; then
  cp -f "${SOURCE}/docs/AGENTS.md" "${TARGET}/AGENTS.md"
fi

# Remove the obsolete location used by earlier installer versions.
rm -f "${TARGET}/.agents/AGENTS.md"

echo "Skills installed successfully."
