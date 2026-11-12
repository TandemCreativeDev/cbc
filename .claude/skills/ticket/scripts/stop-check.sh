#!/usr/bin/env bash
# Stop hook for the cbc-implementer agent: blocks finishing until the PR title and body are written, check.sh
# passed on the current code, and the PR is open against its base, pushed and free of AI attribution. Passes
# straight through in the plan phase (the agent stops to show its plan), on a BLOCKED body, on a second stop,
# or off a ticket branch.

INPUT="$(cat)"
CWD="$(jq -r '.cwd // empty' <<< "$INPUT" 2>/dev/null)"
[ -z "$CWD" ] || cd "$CWD" 2>/dev/null || exit 0
[ "$(jq -r '.stop_hook_active // false' <<< "$INPUT" 2>/dev/null)" = "true" ] && exit 0
# As a subagent hook the cwd is the main checkout; a worktree-isolated agent's worktree is named after it
AGENT="$(jq -r '.agent_id // empty' <<< "$INPUT" 2>/dev/null)"
if [ -n "$AGENT" ]; then
  MAIN="$(dirname "$(cd "$(git rev-parse --git-common-dir 2>/dev/null)" 2>/dev/null && pwd)")"
  [ -d "$MAIN/.claude/worktrees/agent-$AGENT" ] && { cd "$MAIN/.claude/worktrees/agent-$AGENT" || exit 0; }
fi

. "$(dirname "$0")/lib.sh"
CODE="$(current_code 2>/dev/null)" || exit 0
LOOP="$STATE/$CODE/loop"
[ -f "$LOOP" ] || exit 0
[ "$(sed -n 's/^PHASE=//p' "$LOOP" | tail -1)" = plan ] && exit 0

S=".claude/skills/ticket/scripts"
block() { echo "Not finished: $1" >&2; exit 2; }
BODY="$STATE/$CODE/pr.md"
[ -s "$BODY" ] || block "write the PR body to $BODY from .claude/skills/ticket/pr-template.md and the title to $STATE/$CODE/title, then run $S/check.sh and $S/ship.sh."
grep -qE '^Status:[[:space:]]*BLOCKED' "$BODY" && exit 0
[ -z "$(git status --porcelain --untracked-files=no)" ] || block "commit your changes, then run $S/check.sh and $S/ship.sh."
[ "$(cat "$STATE/$CODE/gates.ok" 2>/dev/null)" = "$(working_tree)" ] || block "code changed since the last green check.sh: run $S/check.sh again, then $S/ship.sh."
BRANCH="$(git branch --show-current)"
BASE="$(env_get "$CODE" BASE)"
PR="$(gh pr list --head "$BRANCH" --state open --json number,baseRefName,body -q '.[0]' 2>/dev/null)"
[ -n "$PR" ] || block "no open PR for $BRANCH: run $S/ship.sh."
[ "$(jq -r .baseRefName <<< "$PR")" = "$BASE" ] || block "the PR targets $(jq -r .baseRefName <<< "$PR"), not $BASE: gh pr edit --base $BASE."
attribution_in "$(jq -r .body <<< "$PR")" && block "remove the AI attribution from the PR body and run $S/ship.sh again."
[ -z "$(git log '@{u}..HEAD' --oneline 2>/dev/null)" ] || block "commits are not pushed: run $S/ship.sh."
exit 0
