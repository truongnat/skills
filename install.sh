#!/usr/bin/env bash
set -euo pipefail

OWNER="${SIMPLE_SKILLS_OWNER:-truongnat}"
REPO="${SIMPLE_SKILLS_REPO:-simple-skills}"
BRANCH="${SIMPLE_SKILLS_BRANCH:-main}"
GITHUB="${OWNER}/${REPO}"

TARGET="$(pwd)"
SOURCE=""
TMP=""

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

if [ -d "skills" ]; then
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
  mkdir -p "${TARGET}/.agents/skills/${skill}"
  cp -R "${skill_path}." "${TARGET}/.agents/skills/${skill}/"
done

cp -f "${SOURCE}/docs/DESIGN_SYSTEM.md" "${TARGET}/.agents/DESIGN_SYSTEM.md"
cp -f "${SOURCE}/docs/TOOLS.md" "${TARGET}/.agents/TOOLS.md"
cp -f "${SOURCE}/docs/AGENTS.md" "${TARGET}/.agents/AGENTS.md"

echo "Skills installed successfully."
