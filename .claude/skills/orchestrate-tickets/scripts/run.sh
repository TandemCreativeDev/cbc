#!/usr/bin/env bash
# State and plumbing for one /orchestrate-tickets run: several tickets in flight at once, each in its own git
# worktree under .claude/worktrees/. The queue is .git/ticket/orchestrate, one line per ticket,
# "<issue number> <state> <note>", where state is queued, started, done or skipped. Per-ticket state stays where
# /ticket and /tickets keep it (.git/ticket/<issue number>/), plus WORKTREE in its env file.
#
# Usage: run.sh init [--plan] [--parallel <n>] [--max <n>] [<issue number>...]
#            Builds the queue from the numbers given, or from every startable ticket on the board (yours, then
#            ready), capped at --max (default 6, ORCH_TICKETS_MAX; 0 means no cap). With no numbers and a queue
#            that still has work, resumes it. --parallel caps tickets in flight (default 3, ORCH_TICKETS_PARALLEL).
#        run.sh ready              Queued tickets that can start now, and free slots
#        run.sh launch <n>         Marks a startable ticket started; prints the implementer's setup command
#        run.sh setup <n>          Implementer, inside its own worktree: claims, branches, copies env, installs
#        run.sh loop <n> <args>    loop.sh in the ticket's worktree (round, verdict, phase build, status)
#        run.sh ship <n>           ship.sh in the ticket's worktree
#        run.sh done <n> <ready|parked> [<note>]
#                                  Records how a ticket ended and frees its worktree when it is clean and pushed
#        run.sh merge <n>          --merge runs only, after ship: waits for green checks, checks the deploy preview,
#                                  squash-merges, syncs main and frees the worktree
#        run.sh status             Every ticket in the run: state, worktree, PR, round and verdict
#
# --merge (init): the driver merges each PR once its review is ALL CLEAR, every check is green and the deploy
# preview serves the site. Dependents then start from main once their parent has merged, never stacked.

. "$(dirname "$0")/../../ticket/scripts/lib.sh"
T="$(cd "$(dirname "$0")/../../ticket/scripts" && pwd)"
L="$(cd "$(dirname "$0")/../../tickets/scripts" && pwd)"
SELF="$(cd "$(dirname "$0")" && pwd)/run.sh"
[ -n "$ROOT" ] || die ORCH "not inside a git repository"
COMMON="$(cd "$(git rev-parse --git-common-dir)" && pwd)"
MAIN="$(dirname "$COMMON")"
QUEUE="$STATE/orchestrate"
CONF="$STATE/orchestrate.conf"
mkdir -p "$STATE"

conf() { [ -f "$CONF" ] && sed -n "s/^$1=//p" "$CONF" | tail -1; }
plan_flag() { [ "$(conf PLAN)" = 1 ] && echo --plan; }
set_state() {  # set_state <issue number> <state> [<note>]
  local tmp; tmp="$(mktemp)"
  awk -v n="$1" -v s="$2" -v note="${3:-}" '$1 == n { print n, s, note; next } { print }' "$QUEUE" > "$tmp" && mv "$tmp" "$QUEUE"
}
state_of() { [ -f "$QUEUE" ] && awk -v n="$1" '$1 == n { print $2 }' "$QUEUE"; }
wt_of() { local w; w="$(env_get "$1" WORKTREE)"; [ -n "$w" ] && [ -d "$w" ] && echo "$w"; }
in_flight() { awk '$2 == "started"' "$QUEUE" | grep -c .; }
need_n() { [[ "${1:-}" =~ ^[0-9]+$ ]] || die ORCH "usage: run.sh $2 <issue number>"; }

PRS=""
prs() { [ -n "$PRS" ] || PRS="$(gh pr list --state open --limit 100 --json number,headRefName,isDraft)" || die ORCH "gh pr list"; }
draft_of() { jq -r --arg b "$1" '.[] | select(.headRefName == $b) | .isDraft' <<< "$PRS"; }

# Why ticket <n> cannot start now, or "from main" / "stacks on <branch>". A dependency holds it back while it is an
# open issue with no PR, or with a draft PR (its review has not cleared, so its code is still moving).
start_point() {
  local n="$1" issue body d dpr stack=() wait=()
  issue="$(gh issue view "$n" --json state,body,labels,assignees)" || { echo "WAIT gh issue view $n failed"; return; }
  [ "$(jq -r .state <<< "$issue")" = OPEN ] || { echo "WAIT closed"; return; }
  jq -e --arg l "$PARKED_LABEL" '.labels | any(.name == $l)' <<< "$issue" >/dev/null && { echo "WAIT parked label"; return; }
  local who; who="$(jq -r '[.assignees[].login] | join(" ")' <<< "$issue")"
  [ -z "$who" ] || [[ " $who " == *" $(me) "* ]] || { echo "WAIT claimed by @${who// /, @}"; return; }
  body="$(jq -r .body <<< "$issue")"
  prs
  for d in $(deps_of "$body"); do
    [ "$(gh issue view "$d" --json state -q .state 2>/dev/null)" = OPEN ] || continue
    dpr="$(pr_for_code "$d" "$PRS")"
    if [ -z "$dpr" ]; then wait+=("#$d (no PR)")
    elif [ "$(draft_of "${dpr#* }")" = true ]; then wait+=("#$d (PR #${dpr%% *} still in review)")
    elif [ "$(conf MERGE)" = 1 ]; then wait+=("#$d (PR #${dpr%% *} not merged yet)")
    else stack+=("${dpr#* }"); fi
  done
  [ ${#wait[@]} -eq 0 ] || { echo "WAIT waits on ${wait[*]}"; return; }
  [ ${#stack[@]} -le 1 ] || { echo "WAIT two parents ready for review (${stack[*]}): the user merges one first"; return; }
  if [ ${#stack[@]} -eq 1 ]; then echo "GO stacks on ${stack[0]}"; else echo "GO from $TRUNK"; fi
}

show() {
  echo "## Run"
  [ -s "$QUEUE" ] || { echo "- empty"; echo; return; }
  prs
  while read -r n s note; do
    line="- #$n  $s${note:+  $note}"
    if [ "$s" = started ]; then
      w="$(wt_of "$n")"
      if [ -n "$w" ]; then
        b="$(git -C "$w" branch --show-current)"
        line="$line · worktree ${w#"$MAIN"/} · $b"
        pr="$(pr_for_code "$n" "$PRS")"
        if [ -n "$pr" ]; then
          line="$line · PR #${pr%% *}$([ "$(draft_of "${pr#* }")" = true ] && echo ' (draft)')"
        else
          line="$line · no PR · $(git -C "$w" rev-list --count "origin/$(env_get "$n" BASE)..HEAD" 2>/dev/null || echo 0) commit(s)"
        fi
        lf="$STATE/$n/loop"
        [ -f "$lf" ] && line="$line · $(sed -n 's/^PHASE=//p' "$lf" | tail -1) · round $(sed -n 's/^ROUND=//p' "$lf" | tail -1) · $(sed -n 's/^VERDICT=//p' "$lf" | tail -1 | sed 's/^$/no verdict/')"
      else
        line="$line · no worktree yet"
      fi
    fi
    echo "$line"
  done < "$QUEUE"
  echo
}

case "${1:-}" in
  init)
    shift
    MAX="${ORCH_TICKETS_MAX:-6}"; PAR="${ORCH_TICKETS_PARALLEL:-3}"; PLAN=0; MERGE=0; NUMS=()
    while [ $# -gt 0 ]; do
      case "$1" in
        --plan) PLAN=1 ;;
        --merge) MERGE=1 ;;
        --max) MAX="$2"; shift ;;
        --parallel) PAR="$2"; shift ;;
        *) n="${1#\#}"; [[ "$n" =~ ^[0-9]+$ ]] || die ORCH "usage: /orchestrate-tickets [--plan] [--merge] [--parallel <n>] [--max <n>] [<issue number>...]"; NUMS+=("$n") ;;
      esac
      shift
    done
    [[ "$PAR" =~ ^[1-9][0-9]*$ ]] || die ORCH "--parallel must be 1 or more"
    for bin in gh jq pnpm; do command -v "$bin" >/dev/null || die ORCH "$bin not on PATH"; done
    gh auth status >/dev/null 2>&1 || die ORCH "gh is not signed in: gh auth login"
    [ -f "$MAIN/docs/tickets/INSTRUCTIONS.md" ] || die ORCH "docs/tickets/INSTRUCTIONS.md is missing"
    git -C "$MAIN" check-ignore -q .claude/worktrees/x || echo '.claude/worktrees/' >> "$COMMON/info/exclude"

    if [ ${#NUMS[@]} -eq 0 ] && grep -qE ' (queued|started)( |$)' "$QUEUE" 2>/dev/null; then
      echo "ORCH PASS: resuming the last run · parallel $(conf PARALLEL)$([ -n "$(plan_flag)" ] && echo ' · plan pause on')$([ "$(conf MERGE)" = 1 ] && echo ' · merge on')"
    else
      if [ ${#NUMS[@]} -eq 0 ]; then
        while IFS= read -r n; do [ -n "$n" ] && NUMS+=("$n"); done < <("$T/status.sh" --ready)
        [ ${#NUMS[@]} -gt 0 ] || die ORCH "nothing is ready: see the board (/ticket)"
        [ "$MAX" -eq 0 ] || NUMS=("${NUMS[@]:0:$MAX}")
      fi
      : > "$QUEUE"
      for n in "${NUMS[@]}"; do echo "$n queued" >> "$QUEUE"; done
      printf 'PARALLEL=%s\nPLAN=%s\nMERGE=%s\n' "$PAR" "$PLAN" "$MERGE" > "$CONF"
      echo "ORCH PASS: ${#NUMS[@]} ticket(s) · parallel $PAR$([ "$PLAN" = 1 ] && echo ' · plan pause on')$([ "$MERGE" = 1 ] && echo ' · merge on')"
    fi
    echo
    show
    "$SELF" ready
    echo
    "$T/status.sh"
    if [ -f "$MAIN/PROMPT.md" ]; then echo "## Handover (PROMPT.md)"; echo; cat "$MAIN/PROMPT.md"; fi ;;

  ready)
    [ -s "$QUEUE" ] || die ORCH "no run: invoke /orchestrate-tickets first"
    PAR="$(conf PARALLEL)"; IN="$(in_flight)"
    echo "## Startable now ($IN of $PAR slots in use)"
    any=0
    for n in $(awk '$2 == "queued" { print $1 }' "$QUEUE"); do
      sp="$(start_point "$n")"
      echo "- #$n  ${sp#* }$([ "${sp%% *}" = GO ] && echo '  · READY')"
      any=1
    done
    [ "$any" = 1 ] || echo "- nothing queued"
    [ "$IN" -gt 0 ] || awk '$2 == "queued"' "$QUEUE" | grep -q . || echo "RUN DONE: nothing queued or in flight" ;;

  launch)
    need_n "${2:-}" launch; n="$2"
    case "$(state_of "$n")" in
      queued)
        [ "$(in_flight)" -lt "$(conf PARALLEL)" ] || die ORCH "all $(conf PARALLEL) slots are in use: wait for a ticket to finish"
        sp="$(start_point "$n")"
        [ "${sp%% *}" = GO ] || die ORCH "#$n cannot start: ${sp#* }"
        set_state "$n" started
        echo "LAUNCH PASS: #$n · ${sp#* }" ;;
      started) echo "LAUNCH PASS: #$n resumes$([ -n "$(wt_of "$n")" ] && echo " · old worktree $(wt_of "$n")")" ;;
      "") die ORCH "#$n is not in this run" ;;
      *) die ORCH "#$n is already $(state_of "$n")" ;;
    esac
    echo "- implementer setup, first command in its worktree: $SELF setup $n"
    echo "- mode: $([ -n "$(plan_flag)" ] && echo plan-first || echo straight-through)"
    echo "- dev server port: $(port_for "$n")" ;;

  setup)
    need_n "${2:-}" setup; n="$2"
    [ "$(cd "$(git rev-parse --git-dir)" && pwd)" != "$COMMON" ] || die SETUP "run inside your own worktree, never the main checkout"
    open_log "$STATE/$n/setup.log"
    cd "$ROOT" || exit 1
    ORIG="$(git branch --show-current)"
    EX="$(git for-each-ref --format='%(refname:short)' refs/heads | grep -E "^([a-z]+/)?$n-" | head -1)"
    if [ -n "$EX" ] && [ "$ORIG" != "$EX" ]; then
      OLD="$(git worktree list --porcelain | awk -v b="refs/heads/$EX" '/^worktree /{w=substr($0,10)} $0 == "branch " b {print w}')"
      if [ -n "$OLD" ] && [ "$OLD" != "$ROOT" ]; then
        [ -z "$(git -C "$OLD" status --porcelain --untracked-files=no)" ] || die SETUP "$EX has uncommitted work in $OLD: commit it there, or ask the driver"
        step SETUP "free $EX from $OLD" git worktree remove "$OLD"
      fi
    fi
    OUT=""
    for try in 1 2 3; do
      OUT="$("$T/start.sh" "$n" 2>&1)" && break
      grep -q 'git fetch' <<< "$OUT" || break
      sleep $((try * 5))
    done
    grep -q '^START PASS' <<< "$OUT" || { printf '%s\n' "$OUT"; exit 1; }
    env_set "$n" WORKTREE "$ROOT"
    [ -z "$ORIG" ] || [ "$ORIG" = "$(git branch --show-current)" ] || [ -n "$(env_get "$n" ORIG)" ] || env_set "$n" ORIG "$ORIG"
    for f in "$MAIN"/.env* "$MAIN/.neon" "$MAIN/.netlify/state.json"; do
      [ -f "$f" ] || continue
      rel="${f#"$MAIN"/}"
      [ -e "$ROOT/$rel" ] || { mkdir -p "$ROOT/$(dirname "$rel")"; cp "$f" "$ROOT/$rel"; }
    done
    step SETUP "pnpm install" env CI=1 pnpm install --frozen-lockfile
    # shellcheck disable=SC2046
    [ -f "$STATE/$n/loop" ] || "$L/loop.sh" init $(plan_flag) >> "$LOG" 2>&1 || die SETUP "loop.sh init"
    echo "SETUP PASS: #$n · worktree $ROOT · $(git branch --show-current) · base $(env_get "$n" BASE) · port $(port_for "$n")"
    printf '%s\n' "$OUT" | sed '1d' ;;

  loop)
    need_n "${2:-}" "loop"; n="$2"; shift 2
    w="$(wt_of "$n")" || die ORCH "#$n has no worktree"
    cd "$w" && exec "$L/loop.sh" "$@" ;;

  ship)
    need_n "${2:-}" ship; n="$2"
    w="$(wt_of "$n")" || die ORCH "#$n has no worktree"
    cd "$w" && exec "$T/ship.sh" ;;

  "done")
    need_n "${2:-}" "done"; n="$2"
    case "${3:-}" in
      ready) set_state "$n" "done" "${4:-PR ready for review}" ;;
      parked) set_state "$n" skipped "${4:-parked}" ;;
      *) die ORCH "usage: run.sh done <issue number> <ready|parked> [<note>]" ;;
    esac
    lsof -tiTCP:"$(port_for "$n")" -sTCP:LISTEN 2>/dev/null | xargs kill 2>/dev/null
    NOTE=""
    if w="$(wt_of "$n")"; then
      if [ -n "$(git -C "$w" status --porcelain --untracked-files=no)" ]; then NOTE="worktree kept, uncommitted changes: $w"
      elif [ -n "$(git -C "$w" log '@{u}..HEAD' --oneline 2>/dev/null)" ] || ! git -C "$w" rev-parse '@{u}' >/dev/null 2>&1; then NOTE="worktree kept, commits not pushed: $w"
      elif git worktree remove "$w" 2>/dev/null; then NOTE="worktree removed"
      else NOTE="worktree kept, git worktree remove refused: $w"; fi
    fi
    o="$(env_get "$n" ORIG)"
    if [ -n "$o" ] && git show-ref --verify --quiet "refs/heads/$o" && ! git worktree list --porcelain | grep -qx "branch refs/heads/$o" \
      && [ -z "$(git rev-list -1 "$o" --not --exclude="refs/heads/$o" --branches --remotes)" ]; then
      git branch -D "$o" >/dev/null && NOTE="$NOTE · deleted $o"
    fi
    echo "ORCH PASS: #$n ${3}${NOTE:+ · $NOTE}"
    show ;;

  merge)
    need_n "${2:-}" merge; n="$2"
    [ "$(conf MERGE)" = 1 ] || die MERGE "this run was not started with --merge: the user merges"
    open_log "$STATE/$n/merge.log"
    [ "$(sed -n 's/^VERDICT=//p' "$STATE/$n/loop" 2>/dev/null | tail -1)" = "ALL CLEAR" ] || die MERGE "#$n's last review verdict is not ALL CLEAR"
    prs
    pr="$(pr_for_code "$n" "$PRS")"; [ -n "$pr" ] || die MERGE "#$n has no open PR"
    P="${pr%% *}"; B="${pr#* }"
    [ "$(draft_of "$B")" != true ] || die MERGE "PR #$P is still a draft: run.sh ship $n first"
    INFO="$(gh pr view "$P" --json baseRefName,body,mergeable,headRefOid)" || die MERGE "gh pr view $P"
    [ "$(jq -r .baseRefName <<< "$INFO")" = "$TRUNK" ] || die MERGE "PR #$P targets $(jq -r .baseRefName <<< "$INFO"), not $TRUNK: merge its parent first, then rebase it"
    attribution_in "$(jq -r .body <<< "$INFO")" && die MERGE "PR #$P's body carries AI attribution"
    w="$(wt_of "$n")"
    if [ -n "$w" ]; then
      [ -z "$(git -C "$w" status --porcelain --untracked-files=no)" ] || die MERGE "uncommitted changes in $w"
      [ "$(git -C "$w" rev-parse HEAD)" = "$(jq -r .headRefOid <<< "$INFO")" ] || die MERGE "the worktree's HEAD is not what PR #$P carries: push it with run.sh ship $n"
    fi
    case "$(jq -r .mergeable <<< "$INFO")" in
      CONFLICTING) die MERGE "PR #$P conflicts with $TRUNK: the reviewer rebases, runs check.sh and ship.sh" ;;
    esac
    for _ in $(seq 1 30); do
      [ "$(gh pr checks "$P" --json name -q length 2>/dev/null || echo 0)" -gt 0 ] && break
      sleep 10
    done
    [ "$(gh pr checks "$P" --json name -q length 2>/dev/null || echo 0)" -gt 0 ] || die MERGE "no checks registered on PR #$P after 5 minutes"
    step MERGE "checks on PR #$P" gh pr checks "$P" --watch --fail-fast
    PREVIEW="https://deploy-preview-$P--clarksbowlingclub.netlify.app"
    for path in ${ORCH_PREVIEW_PATHS:-/ /tour /music /about /lyrics /contact}; do
      code="$(curl -s -o /dev/null -w '%{http_code}' -L --max-time 30 "$PREVIEW$path")"
      echo "$PREVIEW$path $code" >> "$LOG"
      [ "$code" = 200 ] || die MERGE "deploy preview answered $code for $path: $PREVIEW$path"
    done
    step MERGE "gh pr merge #$P" gh pr merge "$P" --squash
    gh api -X DELETE "repos/{owner}/{repo}/git/refs/heads/$B" >/dev/null 2>&1
    set_state "$n" "done" "merged in PR #$P"
    lsof -tiTCP:"$(port_for "$n")" -sTCP:LISTEN 2>/dev/null | xargs kill 2>/dev/null
    NOTES=()
    if [ -n "$w" ]; then git worktree remove --force "$w" && NOTES+=("worktree removed"); fi
    git branch -D "$B" >/dev/null 2>&1 && NOTES+=("deleted $B")
    o="$(env_get "$n" ORIG)"
    [ -n "$o" ] && git branch -D "$o" >/dev/null 2>&1 && NOTES+=("deleted $o")
    git fetch origin --prune --quiet
    if [ "$(git -C "$MAIN" branch --show-current)" = "$TRUNK" ]; then
      git -C "$MAIN" merge --ff-only --quiet "origin/$TRUNK" 2>/dev/null && NOTES+=("main checkout fast-forwarded") || NOTES+=("main checkout could not fast-forward: sync it by hand")
    else
      git fetch origin "$TRUNK:$TRUNK" --quiet 2>/dev/null && NOTES+=("local $TRUNK updated")
    fi
    echo "MERGE PASS: #$n · PR #$P squash-merged into $TRUNK · $(IFS=';'; echo "${NOTES[*]}" | sed 's/;/ · /g')"
    echo "- Netlify now builds production from $TRUNK: confirm the deploy is published and https://clarksbowlingclub.com answers before the next merge"
    show ;;

  status) show ;;
  *) die ORCH "usage: run.sh init [--plan] [--merge] [--parallel <n>] [--max <n>] [<n>...] | ready | launch <n> | setup <n> | loop <n> <args> | ship <n> | merge <n> | done <n> <ready|parked> [note] | status" ;;
esac
