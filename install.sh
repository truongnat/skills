#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

echo "Installing skills..."

mkdir -p .agents/skills

skill_count=0
for skill_path in skills/*/; do
  [ -d "$skill_path" ] || continue
  skill_count=$((skill_count + 1))
done

echo "Found ${skill_count} skills."

for skill_path in skills/*/; do
  [ -d "$skill_path" ] || continue
  skill="$(basename "$skill_path")"
  echo "Installing skill ${skill} ..."
  mkdir -p ".agents/skills/${skill}"
  cp -R "${skill_path}." ".agents/skills/${skill}/"
done

cp -f docs/design-system.md .agents/design-system.md
cp -f docs/AGENTS.md .agents/AGENTS.md

echo "Skills installed successfully."
