#!/usr/bin/env bash
# The queue for one /tickets run, in .git/ticket/queue: one line per ticket, "<issue number> <state> <note>",
# where state is queued, started, done or skipped.
#
# Usage: queue.sh init [--plan] [--max <n>] [<issue number>...]
#            Builds the queue from the numbers given, or from every startable ticket on the board (yours, then
#            ready), capped at --max (default 3, TICKETS_MAX; 0 means no cap). With no arguments and a queue
#            that still has work, resumes it.
#        queue.sh next
#            Starts the first queued ticket that can start (its dependencies are closed or in review), and
#            opens its loop. A ticket that cannot start yet stays queued for a later pass. Prints QUEUE DONE
#            when nothing is left to start.
#        queue.sh done <issue number> <ready|parked> [<note>]
#            Records how a started ticket ended.
#        queue.sh status

. "$(dirname "$0")/../../ticket/scripts/lib.sh"
T="$(cd "$(dirname "$0")/../../ticket/scripts" && pwd)"
L="$(cd "$(dirname "$0")" && pwd)"
QUEUE="$STATE/queue"
[ -n "$ROOT" ] || die QUEUE "not inside a git repository"
mkdir -p "$STATE"

show() {
  echo "## Queue"
  if [ -s "$QUEUE" ]; then sed -E 's/^([0-9]+) ([a-z]+) ?(.*)$/- #\1  \2  \3/; s/ +$//' "$QUEUE"; else echo "- empty"; fi
  echo
}
plan_flag() { [ -f "$STATE/queue.plan" ] && echo --plan; }
set_state() {  # set_state <issue number> <state> [<note>]
  local tmp; tmp="$(mktemp)"
  awk -v n="$1" -v s="$2" -v note="${3:-}" '$1 == n { print n, s, note; next } { print }' "$QUEUE" > "$tmp" && mv "$tmp" "$QUEUE"
}

case "${1:-}" in
  init)
    shift
    MAX="${TICKETS_MAX:-3}"; PLAN=""; NUMS=()
    while [ $# -gt 0 ]; do
      case "$1" in
        --plan) PLAN=1 ;;
        --max) MAX="$2"; shift ;;
        *) n="${1#\#}"; [[ "$n" =~ ^[0-9]+$ ]] || die QUEUE "usage: /tickets [--plan] [--max <n>] [<issue number>...]"; NUMS+=("$n") ;;
      esac
      shift
    done
    for bin in gh jq pnpm; do command -v "$bin" >/dev/null || die QUEUE "$bin not on PATH"; done
    gh auth status >/dev/null 2>&1 || die QUEUE "gh is not signed in: gh auth login"
    [ -z "$(git -C "$ROOT" status --porcelain --untracked-files=no)" ] || die QUEUE "uncommitted changes on $(git branch --show-current): commit or stash them"
    [ -f "$ROOT/docs/tickets/INSTRUCTIONS.md" ] || die QUEUE "docs/tickets/INSTRUCTIONS.md is missing"

    if [ ${#NUMS[@]} -eq 0 ] && grep -qE ' (queued|started)( |$)' "$QUEUE" 2>/dev/null; then
      echo "QUEUE PASS: resuming the last run$([ -n "$(plan_flag)" ] && echo ' · plan pause on')"
    else
      if [ ${#NUMS[@]} -eq 0 ]; then
        while IFS= read -r n; do [ -n "$n" ] && NUMS+=("$n"); done < <("$T/status.sh" --ready)
        [ ${#NUMS[@]} -gt 0 ] || die QUEUE "nothing is ready: see the board (/ticket)"
        [ "$MAX" -eq 0 ] || NUMS=("${NUMS[@]:0:$MAX}")
      fi
      : > "$QUEUE"
      for n in "${NUMS[@]}"; do echo "$n queued" >> "$QUEUE"; done
      rm -f "$STATE/queue.plan"; [ -z "$PLAN" ] || : > "$STATE/queue.plan"
      echo "QUEUE PASS: ${#NUMS[@]} ticket(s)$([ -n "$PLAN" ] && echo ' · plan pause on')"
    fi
    echo
    show
    "$T/status.sh" ;;
  next)
    [ -s "$QUEUE" ] || die QUEUE "no queue: run /tickets first"
    RUNNING="$(awk '$2 == "started" { print $1 }' "$QUEUE" | head -1)"
    if [ -n "$RUNNING" ]; then
      echo "QUEUE PASS: #$RUNNING is still in flight, resume it"
      "$T/start.sh" "$RUNNING" || exit 1
      echo
      # shellcheck disable=SC2046
      "$L/loop.sh" status 2>/dev/null || "$L/loop.sh" init $(plan_flag)
      exit 0
    fi
    WHY=()
    # shellcheck disable=SC2013
    for n in $(awk '$2 == "queued" { print $1 }' "$QUEUE"); do
      if OUT="$("$T/start.sh" "$n" 2>&1)"; then
        set_state "$n" started
        echo "QUEUE PASS: started #$n"
        printf '%s\n' "$OUT"
        echo
        # shellcheck disable=SC2046
        "$L/loop.sh" init $(plan_flag)
        exit 0
      fi
      WHY+=("#$n: $(printf '%s\n' "$OUT" | grep -m1 'FAIL' | sed 's/^START FAIL: //')")
    done
    echo "QUEUE DONE: nothing left that can start"
    [ ${#WHY[@]} -eq 0 ] || { echo "Still queued, cannot start yet:"; printf -- '- %s\n' "${WHY[@]}"; }
    echo
    show ;;
  "done")
    [[ "${2:-}" =~ ^[0-9]+$ ]] || die QUEUE "usage: queue.sh done <issue number> <ready|parked> [<note>]"
    case "${3:-}" in
      ready) set_state "$2" "done" "${4:-PR ready for review}" ;;
      parked) set_state "$2" skipped "${4:-parked}" ;;
      *) die QUEUE "usage: queue.sh done <issue number> <ready|parked> [<note>]" ;;
    esac
    echo "QUEUE PASS: #$2 ${3}"
    show ;;
  status) show ;;
  *) die QUEUE "usage: queue.sh init [--plan] [--max <n>] [<issue number>...] | next | done <n> <ready|parked> [<note>] | status" ;;
esac
