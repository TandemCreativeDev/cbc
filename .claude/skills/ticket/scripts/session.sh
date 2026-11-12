#!/usr/bin/env bash
# Entry point for /ticket: with an issue number, starts or resumes that ticket; with `next`, claims and starts
# the next available one (yours first, then the first ready one); without an argument, resumes the ticket of
# the current branch, else prints the board.
#
# Usage: session.sh [<issue number>|next] [type] [--base <branch>]

. "$(dirname "$0")/lib.sh"
if [ $# -eq 0 ] && CODE="$(current_code 2>/dev/null)" && [ -f "$(env_file "$CODE")" ]; then
  set -- "$CODE"
fi
if [ $# -eq 0 ]; then exec "$(dirname "$0")/status.sh"; fi
if [ "$1" = next ]; then
  shift
  N="$("$(dirname "$0")/status.sh" --next)" || { echo "$N"; exit 1; }
  echo "NEXT PASS: #$N is the next available ticket"
  set -- "$N" "$@"
fi
exec "$(dirname "$0")/start.sh" "$@"
