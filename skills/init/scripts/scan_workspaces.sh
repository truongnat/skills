#!/usr/bin/env bash
# Deterministic, ecosystem-agnostic workspace scanner for the init skill.
#
# Finds EVERY project manifest under the repo — regardless of whether it is
# declared in a JS/TS workspace config (pnpm-workspace.yaml, turbo.json, root
# package.json "workspaces", …). A Flutter/Dart, Go, Rust, or Python app sitting
# under apps/ is usually NOT listed in those configs, so enumerating from them
# alone silently misses whole stacks. This sweep reads the filesystem instead.
#
# Read-only: it never executes project code, installs anything, or reads secrets.
# Output: one tab-separated row per detected project — RELATIVE_DIR<TAB>STACK<TAB>MANIFEST
#
# Usage: bash scan_workspaces.sh [ROOT]   (ROOT defaults to the current dir)
set -eu

ROOT="${1:-$(pwd)}"
cd "$ROOT"

# Directories that never contain a first-party app we care about. Includes
# build/cache dirs, native platform host folders that mobile toolchains
# generate (ios/android/macos/windows/linux), generated code, and the .agents
# skill-install dir. NOTE: "web" is intentionally NOT pruned — it is a common
# real app name (apps/web); Flutter's web/ platform folder has no manifest.
PRUNE_DIRS='node_modules .git dist build out .next .nuxt .svelte-kit .turbo
.dart_tool .gradle target vendor .venv venv __pycache__ .idea .vscode coverage
Pods .terraform .expo .cache tmp .pnpm-store .agents
ios android macos windows linux ephemeral generated .symlinks
.plugin_symlinks'

prune_expr=""
for d in $PRUNE_DIRS; do
  prune_expr="$prune_expr -name $d -o"
done
prune_expr="${prune_expr% -o}"

# Manifest filenames that mark a project root, across ecosystems.
MANIFESTS='package.json pubspec.yaml Cargo.toml go.mod pom.xml build.gradle
build.gradle.kts pyproject.toml requirements.txt setup.py composer.json Gemfile
Package.swift *.csproj'

name_expr=""
for m in $MANIFESTS; do
  name_expr="$name_expr -name $m -o"
done
name_expr="${name_expr% -o}"

# Classify a manifest file into a concrete stack. Refines package.json by deps.
classify() {
  file="$1"; base="$(basename "$file")"
  case "$base" in
    pubspec.yaml)
      if grep -qE '^\s*flutter:' "$file" 2>/dev/null; then echo "Flutter/Dart"; else echo "Dart"; fi ;;
    Cargo.toml)   echo "Rust" ;;
    go.mod)       echo "Go" ;;
    pom.xml)      echo "Java/Maven" ;;
    build.gradle|build.gradle.kts)
      if grep -qiE 'com\.android\.|kotlin' "$file" 2>/dev/null; then echo "Kotlin/Android (Gradle)"; else echo "JVM (Gradle)"; fi ;;
    pyproject.toml|requirements.txt|setup.py) echo "Python" ;;
    composer.json) echo "PHP" ;;
    Gemfile)       echo "Ruby" ;;
    Package.swift) echo "Swift" ;;
    *.csproj)      echo ".NET/C#" ;;
    package.json)
      if   grep -qE '"(next)"\s*:' "$file" 2>/dev/null; then echo "Next.js (Node/TS)"
      elif grep -qE '"@nestjs/' "$file" 2>/dev/null; then echo "NestJS (Node/TS)"
      elif grep -qE '"expo"\s*:' "$file" 2>/dev/null; then echo "Expo (React Native)"
      elif grep -qE '"react-native"\s*:' "$file" 2>/dev/null; then echo "React Native"
      elif grep -qE '"(react)"\s*:' "$file" 2>/dev/null; then echo "React (Node/TS)"
      elif grep -qE '"(vue)"\s*:' "$file" 2>/dev/null; then echo "Vue (Node/TS)"
      elif grep -qE '"(svelte)"\s*:' "$file" 2>/dev/null; then echo "Svelte (Node/TS)"
      else echo "Node/JS-TS"; fi ;;
    *) echo "Unknown" ;;
  esac
}

# shellcheck disable=SC2086
find . \( $prune_expr \) -prune -o -type f \( $name_expr \) -print 2>/dev/null \
| LC_ALL=C sort \
| while IFS= read -r f; do
    dir="$(dirname "$f")"; dir="${dir#./}"; [ "$dir" = "." ] && dir="(root)"
    stack="$(classify "$f")"
    printf '%s\t%s\t%s\n' "$dir" "$stack" "${f#./}"
  done
