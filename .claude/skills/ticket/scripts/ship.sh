#!/usr/bin/env bash
# Ships the ticket: refuses unless everything is committed, check.sh passed on this exact tree and the PR title
# and body are clean, then pushes and opens or updates the PR. Run from /ticket, PRs open ready for review.
# Inside /tickets, the implementer's first ship opens a draft, a NOT CLEAR verdict refuses to ship, and ALL CLEAR
# pushes the reviewer's fixes and marks the PR ready.
#
# Usage: ship.sh   (reads .git/ticket/<issue number>/title and pr.md)

. "$(dirname "$0")/lib.sh"
CODE="$(current_code)" || die SHIP "not on a ticket branch"
N="$CODE"
BODY_FILE="$STATE/$CODE/pr.md"
TITLE_FILE="$STATE/$CODE/title"
open_log "$STATE/$CODE/ship.log"
cd "$ROOT" || exit 1
BASE="$(env_get "$CODE" BASE)"; BASE="${BASE:-$TRUNK}"

DIRTY="$(git status --porcelain --untracked-files=no; git status --porcelain -- src public docs .github .claude | grep '^??')"
[ -z "$DIRTY" ] || { echo "$DIRTY" >> "$LOG"; die SHIP "uncommitted files, or untracked files in the repo's code: commit them, then run check.sh"; }
[ "$(cat "$STATE/$CODE/gates.ok" 2>/dev/null)" = "$(working_tree)" ] || die SHIP "code changed since the last green check.sh: run it again"
[ -s "$TITLE_FILE" ] || die SHIP "write the PR title to $TITLE_FILE: one line, <type>(<scope>): <summary>"
TITLE="$(head -1 "$TITLE_FILE")"
[[ "$TITLE" =~ $TITLE_RE ]] || die SHIP "PR title '$TITLE' is not <type>(<scope>): <lower-case imperative summary>, 72 characters at most"
[ -s "$BODY_FILE" ] || die SHIP "write the PR body to $BODY_FILE (the skill's pr-template.md)"
grep -q "Closes #$N" "$BODY_FILE" || die SHIP "the PR body must say 'Closes #$N'"
attribution_in "$TITLE $(cat "$BODY_FILE")" && die SHIP "remove the AI attribution from the PR title or body"
attribution_in "$(git log --format=%B "origin/$BASE..HEAD")" && die SHIP "a commit message carries AI attribution: reword it"

LOOP="$STATE/$CODE/loop"; VERDICT=""; DRAFT=()
if [ -f "$LOOP" ]; then
  VERDICT="$(sed -n 's/^VERDICT=//p' "$LOOP" | tail -1)"
  case "$VERDICT" in
    "") DRAFT=(--draft) ;;
    "NOT CLEAR") die SHIP "the last review verdict is NOT CLEAR: /tickets ships only after ALL CLEAR" ;;
    "ALL CLEAR") grep -q 'Verdict: ALL CLEAR' "$BODY_FILE" || die SHIP "the PR body has no 'Verdict: ALL CLEAR' line in its ## Review section" ;;
  esac
fi

BRANCH="$(git branch --show-current)"
step SHIP "git push" git push -u origin "$BRANCH"
gh pr view "$BRANCH" >/dev/null 2>&1 \
  || step SHIP "gh pr create" gh pr create --base "$BASE" --head "$BRANCH" --title "$TITLE" --body-file "$BODY_FILE" "${DRAFT[@]}"
PR="$(gh pr view "$BRANCH" --json number,url -q '"#\(.number) \(.url)"')" || die SHIP "no PR for $BRANCH"
step SHIP "set PR title and body" gh pr edit "$BRANCH" --title "$TITLE" --body-file "$BODY_FILE"
if [ "$VERDICT" = "ALL CLEAR" ] && [ "$(gh pr view "$BRANCH" --json isDraft -q .isDraft)" = true ]; then
  step SHIP "gh pr ready" gh pr ready "$BRANCH"
fi
IS_DRAFT="$(gh pr view "$BRANCH" --json isDraft -q .isDraft)"
echo "SHIP PASS: $PR · base $(gh pr view "$BRANCH" --json baseRefName -q .baseRefName)$([ "$IS_DRAFT" = true ] && echo ' · draft until the review clears')"
echo "- Netlify builds a deploy preview for this PR: gh pr checks $BRANCH"
