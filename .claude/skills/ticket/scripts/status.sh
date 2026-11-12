#!/usr/bin/env bash
# The board: open tickets in flight (open PR), yours (claimed by you, no PR yet), ready (unclaimed, every
# dependency closed or one with an open PR to stack on), claimed by someone else, blocked on a person (a
# "## Blocked on" section), waiting on another ticket, and parked (the `parked` label).
# --next prints only the issue number to start: your own claimed ticket first, else the first ready one.
# --ready prints every startable issue number (yours, then ready), one per line, lowest first.
#
# Usage: status.sh [--next|--ready]

. "$(dirname "$0")/lib.sh"
[ -n "$ROOT" ] || die STATUS "not inside a git repository"
for bin in gh jq; do command -v "$bin" >/dev/null || die STATUS "$bin not on PATH"; done
MODE="${1:-}"

ME="$(me)" || die STATUS "gh api user"
ISSUES="$(fetch_tickets)" || die STATUS "gh issue list"
PRS="$(gh pr list --state open --limit 100 --json number,headRefName,baseRefName,isDraft)" || die STATUS "gh pr list"

# A dependency holds a ticket back only while it is an open issue: closed and deleted ones are done with
is_open() { jq -e --argjson n "$1" 'select(.number == $n)' <<< "$ISSUES" >/dev/null; }
field() { jq -r --argjson n "$1" "select(.number == \$n) | $2" <<< "$ISSUES"; }

INFLIGHT=(); MINE=(); READY=(); CLAIMED=(); BLOCKED=(); WAITING=(); PARKED=()
while IFS='|' read -r n who labels title; do
  body="$(field "$n" .body)"
  pr="$(pr_for_code "$n" "$PRS")"
  owner="${who:+ · @${who// /, @}}"
  if [ -n "$pr" ]; then
    INFLIGHT+=("$n	#$n $title	PR #${pr%% *} (${pr#* })$owner")
    continue
  fi
  if [[ " $labels " == *" $PARKED_LABEL "* ]]; then
    PARKED+=("$n	#$n $title	")
    continue
  fi
  open=(); stack=()
  for d in $(deps_of "$body"); do
    is_open "$d" || continue
    dpr="$(pr_for_code "$d" "$PRS")"
    if [ -n "$dpr" ]; then stack+=("${dpr#* }"); else open+=("#$d"); fi
  done
  if [ ${#open[@]} -gt 0 ]; then
    WAITING+=("$n	#$n $title	waits on ${open[*]}$owner")
  elif [ ${#stack[@]} -gt 1 ]; then
    WAITING+=("$n	#$n $title	two parents in review (${stack[*]}): merge one first$owner")
  elif hb="$(blocked_on "$body")"; [ -n "$hb" ]; then
    BLOCKED+=("$n	#$n $title	${hb:0:90}$owner")
  elif [ -z "$who" ]; then
    READY+=("$n	#$n $title	${stack[0]:+stacks on ${stack[0]}}")
  elif [[ " $who " == *" $ME "* ]]; then
    MINE+=("$n	#$n $title	${stack[0]:+stacks on ${stack[0]}}")
  else
    CLAIMED+=("$n	#$n $title	@${who// /, @}${stack[0]:+ · stacks on ${stack[0]}}")
  fi
done < <(jq -r '"\(.number)|\(.assignees | join(" "))|\(.labels | join(" "))|\(.title)"' <<< "$ISSUES")

numbers() { [ $# -gt 0 ] && printf '%s\n' "$@" | sort -t$'\t' -k1,1n | cut -f1; }
if [ "$MODE" = --ready ]; then
  numbers "${MINE[@]}"; numbers "${READY[@]}"
  exit 0
fi
if [ "$MODE" = --next ]; then
  pick="$( { numbers "${MINE[@]}"; numbers "${READY[@]}"; } | head -1)"
  [ -n "$pick" ] || die NEXT "nothing ready: every unclaimed ticket waits on another, is claimed, parked, or is blocked on someone"
  echo "$pick"
  exit 0
fi

print() {  # print <heading> <rows...>
  local h="$1"; shift
  echo "## $h ($#)"
  [ $# -gt 0 ] && printf '%s\n' "$@" | sort -t$'\t' -k1,1n | cut -f2- | sed $'s/\t$//; s/\t/  /; s/^/- /'
  echo
}

echo "STATUS PASS: trunk $TRUNK · on $(git branch --show-current) · you are @$ME"
echo
print "In flight" "${INFLIGHT[@]}"
print "Yours, claimed and not started" "${MINE[@]}"
print "Ready" "${READY[@]}"
print "Claimed by someone else" "${CLAIMED[@]}"
print "Blocked on someone (start by number once they have supplied it)" "${BLOCKED[@]}"
print "Waiting on another ticket" "${WAITING[@]}"
print "Parked (label: $PARKED_LABEL)" "${PARKED[@]}"
