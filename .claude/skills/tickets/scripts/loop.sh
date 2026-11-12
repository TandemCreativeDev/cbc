#!/usr/bin/env bash
# State for one ticket's implement/review loop, in .git/ticket/<issue number>/loop: the phase (plan or build),
# the round counter, each round's verdict and finding titles. Deterministic guards: a round cap, and a finding
# whose title repeats from the previous round, which means the loop is not converging.
#
# Usage: loop.sh init [--plan]                       after start.sh, on the ticket branch
#        loop.sh phase build                         after the plan is approved (without --plan, init does it)
#        loop.sh round                               before spawning a reviewer; fails at the cap
#        loop.sh verdict <ALL CLEAR|NOT CLEAR> [<finding title>...]
#        loop.sh status

. "$(dirname "$0")/../../ticket/scripts/lib.sh"
MAX_ROUNDS="${TICKET_LOOP_ROUNDS:-3}"
CODE="$(current_code)" || die LOOP "not on a ticket branch"
FILE="$STATE/$CODE/loop"
get() { [ -f "$FILE" ] && sed -n "s/^$1=//p" "$FILE" | tail -1; }
set_() { mkdir -p "$STATE/$CODE"; echo "$1=$2" >> "$FILE"; }

case "${1:-}" in
  init)
    rm -f "$FILE" "$STATE/$CODE"/round-*.findings
    set_ ROUND 0
    if [ "${2:-}" = --plan ]; then set_ MODE plan-first; set_ PHASE plan; else set_ MODE straight-through; set_ PHASE build; fi
    echo "LOOP PASS: #$CODE · mode $(get MODE) · phase $(get PHASE) · max rounds $MAX_ROUNDS" ;;
  phase)
    [ "${2:-}" = build ] || die LOOP "usage: loop.sh phase build"
    set_ PHASE build
    echo "LOOP PASS: #$CODE · phase build" ;;
  round)
    [ -f "$FILE" ] || die LOOP "no loop state: run loop.sh init first"
    [ "$(get PHASE)" = build ] || die LOOP "still in the plan phase: approve the plan (loop.sh phase build) first"
    r=$(( $(get ROUND) + 1 ))
    [ "$r" -le "$MAX_ROUNDS" ] || die LOOP "round cap reached ($MAX_ROUNDS): the loop is not converging, ask the user"
    set_ ROUND "$r"
    echo "LOOP PASS: #$CODE · round $r of $MAX_ROUNDS" ;;
  verdict)
    [ -f "$FILE" ] || die LOOP "no loop state: run loop.sh init first"
    v="${2:-}"; shift 2 2>/dev/null
    case "$v" in "ALL CLEAR"|"NOT CLEAR") ;; *) die LOOP "usage: loop.sh verdict <ALL CLEAR|NOT CLEAR> [<finding title>...]" ;; esac
    r="$(get ROUND)"
    set_ "VERDICT_$r" "$v"; set_ VERDICT "$v"
    printf '%s\n' "$@" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 ]//g; s/  */ /g' | grep . | sort -u > "$STATE/$CODE/round-$r.findings"
    if [ "$r" -gt 1 ] && [ -s "$STATE/$CODE/round-$((r - 1)).findings" ]; then
      rep="$(comm -12 "$STATE/$CODE/round-$((r - 1)).findings" "$STATE/$CODE/round-$r.findings")"
      [ -z "$rep" ] || die LOOP "finding repeated from round $((r - 1)): $(printf '%s' "$rep" | head -3 | paste -sd';' -). Not converging, ask the user"
    fi
    echo "LOOP PASS: #$CODE · round $r · $v · $(grep -c . "$STATE/$CODE/round-$r.findings") open finding(s)" ;;
  status)
    [ -f "$FILE" ] || die LOOP "no loop state for #$CODE"
    echo "LOOP PASS: #$CODE · mode $(get MODE) · phase $(get PHASE) · round $(get ROUND) of $MAX_ROUNDS · verdict $(get VERDICT)"
    for f in "$STATE/$CODE"/round-*.findings; do
      [ -f "$f" ] || continue
      n="$(basename "$f" .findings)"; n="${n#round-}"
      echo "round $n: $(get "VERDICT_$n")"; sed 's/^/  - /' "$f"
    done ;;
  *) die LOOP "usage: loop.sh init [--plan] | phase build | round | verdict <ALL CLEAR|NOT CLEAR> [titles...] | status" ;;
esac
