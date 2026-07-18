#!/usr/bin/env bash
# Active-session helper for the agent lifecycle. Gives every skill/provider ONE
# deterministic answer to "which session am I in?" and "what is the real
# progress?" — so artifacts are never written to a cache/temp path and progress
# is never hand-guessed.
#
# The active session is recorded in .agents/sessions/.current (one line: the
# repo-relative session dir). Read-only except `set`/`new`, which only touch
# that pointer and the session dir.
#
# Usage (run from the repo root, or any subdir — it walks up to find .agents):
#   session.sh current              Print the active session dir (exit 1 if unset)
#   session.sh set <dir|slug>       Point .current at an existing session dir
#   session.sh new <slug>           Create .agents/sessions/Task-N-<slug>, set current
#   session.sh status [dir]         Compute real task progress from <dir>/TASKS.md
#
# `status` prints a summary, a COMPLETE flag, and a corrected mermaid pie to
# paste into OVERVIEW.md / TASKS.md. COMPLETE=yes only when every card is
# done/skipped with nothing blocked or in any other state (e.g. in_progress,
# review). Never report 100%/done while COMPLETE=no.
set -eu

# --- locate repo root (nearest ancestor containing .agents) ---
find_root() {
  d="$(pwd)"
  while [ "$d" != "/" ]; do
    [ -d "$d/.agents" ] && { printf '%s\n' "$d"; return 0; }
    d="$(dirname "$d")"
  done
  # Fall back to cwd so first-run (before .agents exists) still works.
  pwd
}
ROOT="$(find_root)"
SESS_DIR="$ROOT/.agents/sessions"
POINTER="$SESS_DIR/.current"

die() { printf '%s\n' "$*" >&2; exit 1; }

cmd_current() {
  [ -f "$POINTER" ] || die "No active session. A lifecycle skill must run 'session.sh set/new' first (or create .agents/sessions/<Task-N-slug>/ and point .current at it)."
  rel="$(head -n1 "$POINTER" | tr -d '\r\n')"
  [ -n "$rel" ] || die "Active-session pointer is empty: $POINTER"
  [ -d "$ROOT/$rel" ] || die "Active session '$rel' recorded in .current does not exist. Re-set it with 'session.sh set <dir>'."
  printf '%s\n' "$rel"
}

cmd_set() {
  [ "$#" -ge 1 ] || die "Usage: session.sh set <dir|slug>"
  arg="$1"; base="$(basename "$arg")"
  target="$SESS_DIR/$base"
  [ -d "$target" ] || die "Session dir does not exist: .agents/sessions/$base (use 'session.sh new <slug>' to create it)."
  mkdir -p "$SESS_DIR"
  printf '%s\n' ".agents/sessions/$base" > "$POINTER"
  printf '%s\n' ".agents/sessions/$base"
}

cmd_new() {
  [ "$#" -ge 1 ] || die "Usage: session.sh new <slug>"
  slug="$(printf '%s' "$1" | tr ' /' '--' | tr -cd 'A-Za-z0-9._-')"
  mkdir -p "$SESS_DIR"
  # Next Task-N number across existing Task-* dirs.
  n=1
  for d in "$SESS_DIR"/Task-*/; do
    [ -d "$d" ] || continue
    num="$(basename "$d" | sed -n 's/^Task-\([0-9]\{1,\}\)-.*/\1/p')"
    [ -n "$num" ] && [ "$num" -ge "$n" ] && n=$((num + 1))
  done
  name="Task-${n}-${slug}"
  mkdir -p "$SESS_DIR/$name"
  printf '%s\n' ".agents/sessions/$name" > "$POINTER"
  printf '%s\n' ".agents/sessions/$name"
}

cmd_status() {
  rel="${1:-}"
  [ -n "$rel" ] || rel="$(cmd_current)"
  tasks="$ROOT/$rel/TASKS.md"
  [ -f "$tasks" ] || die "No TASKS.md in $rel — nothing to measure."

  # Parse the Progress board: rows like "| [ ] | T-001 | title | todo |".
  # Status is the last table cell; Done is the [ ]/[x] checkbox.
  awk -F'|' '
    /^[[:space:]]*\|[[:space:]]*\[[ xX]\][[:space:]]*\|/ {
      done_cell=$2; status=$(NF-1)
      gsub(/[[:space:]]/,"",done_cell)
      gsub(/^[[:space:]]+|[[:space:]]+$/,"",status)
      status=tolower(status)
      total++
      c[status]++
      if (done_cell=="[x]") checked++
    }
    END{
      todo=c["todo"]+0; ip=c["in_progress"]+0; dn=c["done"]+0
      bl=c["blocked"]+0; sk=c["skipped"]+0
      other=total-todo-ip-dn-bl-sk
      pct=(total>0)?int(dn*100/total):0
      complete=(total>0 && (dn+sk)==total && bl==0 && other==0)?"yes":"no"
      printf "SESSION_TASKS_TOTAL: %d\n", total
      printf "done:%d in_progress:%d todo:%d blocked:%d skipped:%d other:%d\n", dn,ip,todo,bl,sk,other
      printf "PERCENT_DONE: %d%%\n", pct
      printf "COMPLETE: %s\n", complete
      if (checked!=dn) printf "WARNING: %d Done-checkboxes [x] but %d status=done rows — reconcile TASKS.md.\n", checked, dn
      if (other>0) printf "WARNING: %d card(s) in a non-terminal state (e.g. in_progress/review) — cannot be done.\n", other
      print  "--- paste into OVERVIEW.md and TASKS.md ---"
      print  "```mermaid"
      print  "pie title Task status"
      printf "  \"done\" : %d\n", dn
      printf "  \"in_progress\" : %d\n", ip
      printf "  \"todo\" : %d\n", todo
      printf "  \"blocked\" : %d\n", bl
      if (sk>0)    printf "  \"skipped\" : %d\n", sk
      if (other>0) printf "  \"other\" : %d\n", other
      print  "```"
    }
  ' "$tasks"
}

sub="${1:-}"; shift || true
case "$sub" in
  current) cmd_current "$@" ;;
  set)     cmd_set "$@" ;;
  new)     cmd_new "$@" ;;
  status)  cmd_status "$@" ;;
  *) die "Usage: session.sh {current|set <dir>|new <slug>|status [dir]}" ;;
esac
