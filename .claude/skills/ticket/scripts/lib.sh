#!/usr/bin/env bash
# Shared helpers for the /ticket and /tickets scripts. Each script prints one PASS line, or FAIL: <step>, the
# tail of its output and the log path.
# shellcheck disable=SC2034  # TRUNK, PARKED_LABEL and TITLE_RE are read by the scripts that source this file

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
STATE="$(cd "$(git rev-parse --git-common-dir 2>/dev/null)" 2>/dev/null && pwd)/ticket"
TRUNK="${TICKET_TRUNK:-main}"
# An issue with this label is never listed as ready or picked: the work is not planned
PARKED_LABEL="${TICKET_PARKED_LABEL:-parked}"

me() { echo "${TICKET_ME:-$(gh api user -q .login)}"; }

# Every open issue, one JSON object per line: {number, title, body, assignees: [login], labels: [name]}
fetch_tickets() {
  gh issue list --state open --limit 200 --json number,title,body,assignees,labels \
    --jq '.[] | {number, title, body, assignees: [.assignees[].login], labels: [.labels[].name]}'
}

LOG=""

open_log() { mkdir -p "$(dirname "$1")"; LOG="$1"; : > "$LOG"; }

die() {
  echo "$1 FAIL: $2"
  if [ -n "$LOG" ] && [ -s "$LOG" ]; then tail -n 20 "$LOG"; echo "log: $LOG"; fi
  exit 1
}

step() {  # step <prefix> <label> <command...>
  local prefix="$1" label="$2"; shift 2
  echo "\$ $*" >> "$LOG"
  "$@" >> "$LOG" 2>&1 || die "$prefix" "$label"
}

# The issue number in a branch name: feat/27-serve-sheets-from-the-server -> 27
code_from_branch() { echo "$1" | sed -nE 's#^([a-z]+/)?([0-9]+)-.*#\2#p'; }

# branch_for <type> <issue number> <title>: the slug keeps whole words up to 50 characters
branch_for() {
  echo "$1/$2-$(echo "$3" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/ /g' \
    | awk '{ s = $1; for (i = 2; i <= NF && length(s) + length($i) < 50; i++) s = s "-" $i; print s }')"
}

# The lines of one "## <name>" section of an issue body, up to the next heading of any level
section_of() {  # section_of <issue body> <heading text>
  printf '%s\n' "$1" | awk -v h="## $2" 'index($0, h) == 1 {f=1; next} /^#+ / {f=0} f'
}

# Issue numbers this ticket depends on: the #refs on the first line of its "## Depends on" section, up to the
# first sentence end, so a later note such as "Coordinate with #31" is not a dependency.
deps_of() {  # deps_of <issue body>
  section_of "$1" "Depends on" | grep -m1 . | sed -E 's/\. .*//' | grep -oE '#[0-9]+' | tr -d '#' | sort -un
}

# The first line of a ticket's "## Blocked on" section: a person has to supply something before it can start
blocked_on() {  # blocked_on <issue body>
  section_of "$1" "Blocked on" | grep -m1 .
}

# The open PR whose branch carries this issue number, as "<number> <branch>"
pr_for_code() {  # pr_for_code <issue number> <open PR list json>
  jq -r --arg n "$1" '.[] | select(.headRefName | test("^([a-z]+/)?" + $n + "-")) | "\(.number) \(.headRefName)"' <<< "$2" | head -1
}

# Hash of the working tree including untracked files, equal to the commit tree once it is all committed.
# It stages into a throwaway copy of the index, so the real index is never touched.
working_tree() {
  local idx; idx="$(mktemp)"
  cp "$(git rev-parse --git-dir)/index" "$idx"
  GIT_INDEX_FILE="$idx" git add --all >/dev/null 2>&1
  GIT_INDEX_FILE="$idx" git write-tree
  rm -f "$idx"
}

env_file() { echo "$STATE/$1/env"; }
env_get() { [ -f "$(env_file "$1")" ] && sed -n "s/^$2=//p" "$(env_file "$1")" | tail -1; }
env_set() { mkdir -p "$STATE/$1"; echo "$2=$3" >> "$(env_file "$1")"; }

current_code() {
  local code; code="$(code_from_branch "$(git branch --show-current)")"
  [ -n "$code" ] || { echo "not on a ticket branch (<type>/<issue number>-<slug>)" >&2; return 1; }
  echo "$code"
}

# The dev server port for a ticket, so it never collides with the user's own server on 3000
port_for() { echo $(( 4000 + $1 )); }

attribution_in() { grep -qiE 'co-authored-by:.*(claude|anthropic|codex|openai|chatgpt|gemini|google|cursor|copilot|devin|aider)|generated (with|by)|🤖' <<< "$1"; }

TITLE_RE='^(feat|fix|perf|refactor|chore|ci|docs|test|build|style)(\([a-z0-9-]+\))?: [^A-Z].{4,68}$'
