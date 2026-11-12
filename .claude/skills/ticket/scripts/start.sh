#!/usr/bin/env bash
# Starts (or resumes) one ticket: refuses one claimed by someone else, checks its dependencies, claims it
# (assigns you on GitHub), creates <type>/<issue number>-<slug> from the trunk, or from the one parent ticket
# still in review so the PR stacks on it, and prints the issue with where INSTRUCTIONS.md is.
#
# Usage: start.sh <issue number> [feat|fix|perf|refactor|chore|ci|docs|test|build|style] [--base <branch>]
#   --base: branch from this branch instead, even when dependencies are still open

. "$(dirname "$0")/lib.sh"
N=""; TYPE=""; BASE=""
while [ $# -gt 0 ]; do
  case "$1" in
    --base) BASE="$2"; shift ;;
    feat|fix|perf|refactor|chore|ci|docs|test|build|style) TYPE="$1" ;;
    *) N="${1#\#}" ;;
  esac
  shift
done
[ -n "$ROOT" ] || die START "not inside a git repository"
[[ "$N" =~ ^[0-9]+$ ]] || die START "usage: /ticket <issue number>|next [type] [--base <branch>]"
open_log "$STATE/start.log"
cd "$ROOT" || exit 1

ISSUE="$(gh issue view "$N" --json number,title,state,body,labels,assignees)" || die START "gh issue view $N"
TITLE="$(jq -r .title <<< "$ISSUE")"
BODY="$(jq -r .body <<< "$ISSUE")"
[ "$(jq -r .state <<< "$ISSUE")" = OPEN ] || die START "#$N is closed"
jq -e --arg l "$PARKED_LABEL" '.labels | any(.name == $l)' <<< "$ISSUE" >/dev/null \
  && die START "#$N is parked (label $PARKED_LABEL): remove the label first if the work is planned again"
CODE="$N"
ME="$(me)" || die START "gh api user"
ASSIGNEES="$(jq -r '[.assignees[].login] | join(" ")' <<< "$ISSUE")"
if [ -n "$ASSIGNEES" ] && [[ " $ASSIGNEES " != *" $ME "* ]]; then
  die START "#$N is claimed by @${ASSIGNEES// /, @}: pick another ticket, or agree the handover with them first"
fi

NOTES=()
HB="$(blocked_on "$BODY")"
[ -z "$HB" ] || NOTES+=("blocked on someone, per the issue: ${HB:0:120}. Starting anyway because you named it; make sure that input exists")

claim() {  # assigns you on GitHub, once
  [[ " $ASSIGNEES " == *" $ME "* ]] && return 0
  step START "claim #$N (assign @$ME)" gh issue edit "$N" --add-assignee "@me"
  NOTES+=("claimed: #$N assigned to @$ME")
}

print_ticket() {
  echo
  echo "# $TITLE (#$N)"
  echo
  printf '%s\n' "$BODY"
  echo
  echo "## For this ticket"
  echo "- Rules, platform tools and verification methods: docs/tickets/INSTRUCTIONS.md (read it before the plan)"
  echo "- Dev server port for this ticket: $(port_for "$N") (\`pnpm dev --port $(port_for "$N")\`); stop it by port when done"
  echo "- State (logs, gate stamp, PR title and body): .git/ticket/$N/"
}

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  git status --short --untracked-files=no >> "$LOG"
  die START "uncommitted changes on $(git branch --show-current): commit or stash them"
fi

EXISTING="$(git for-each-ref --format='%(refname:short)' refs/heads | grep -E "^([a-z]+/)?$N-" | head -1)"
if [ -n "$EXISTING" ]; then
  step START "switch to $EXISTING" git switch "$EXISTING"
  claim
  echo "START PASS: resumed $EXISTING · base $(env_get "$CODE" BASE)"
  echo "commits: $(git log --oneline "origin/$(env_get "$CODE" BASE)..HEAD" 2>/dev/null | wc -l | tr -d ' ')"
  [ ${#NOTES[@]} -gt 0 ] && printf -- '- %s\n' "${NOTES[@]}"
  print_ticket
  exit 0
fi

PRS="$(gh pr list --state open --limit 100 --json number,headRefName,baseRefName)" || die START "gh pr list"
OPEN=(); STACK=()
for d in $(deps_of "$BODY"); do
  # A dependency holds the ticket back only while it is an open issue: closed and deleted ones are done with
  [ "$(gh issue view "$d" --json state -q .state 2>/dev/null)" = OPEN ] || continue
  dpr="$(pr_for_code "$d" "$PRS")"
  if [ -n "$dpr" ]; then STACK+=("${dpr#* }"); else OPEN+=("#$d"); fi
done
if [ -n "$BASE" ]; then
  [ ${#OPEN[@]} -eq 0 ] && [ ${#STACK[@]} -eq 0 ] || NOTES+=("--base $BASE overrides open dependencies: ${OPEN[*]}${STACK[*]:+ ${STACK[*]}}")
else
  [ ${#OPEN[@]} -eq 0 ] || die START "waits on ${OPEN[*]} (no PR yet): pick another ticket, or pass --base <branch>"
  [ ${#STACK[@]} -le 1 ] || die START "two parents in review (${STACK[*]}): merge one first, or pass --base <branch>"
  BASE="${STACK[0]:-$TRUNK}"
fi

if [ -z "$TYPE" ]; then
  if jq -e '.labels | any(.name == "bug")' <<< "$ISSUE" >/dev/null; then TYPE=fix; else TYPE=feat; fi
fi
BRANCH="$(branch_for "$TYPE" "$N" "$TITLE")"
claim

step START "git fetch" git fetch origin --prune
git rev-parse --verify --quiet "origin/$BASE" >/dev/null || die START "origin/$BASE does not exist: push it first"
step START "create $BRANCH from origin/$BASE" git switch --no-track -c "$BRANCH" "origin/$BASE"
[ "$BASE" = "$TRUNK" ] || NOTES+=("stacked on $BASE: the PR targets it. When it changes or merges, rebase with the gh-stack skill, then check.sh and ship.sh again")

rm -f "$(env_file "$CODE")"
env_set "$CODE" BASE "$BASE"

echo "START PASS: $BRANCH · base $BASE"
[ ${#NOTES[@]} -gt 0 ] && printf -- '- %s\n' "${NOTES[@]}"
print_ticket
