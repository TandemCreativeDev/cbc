#!/usr/bin/env bash
# Runs the gates on the ticket branch (lint, typecheck, build) and stamps the tree they passed on, so ship.sh
# can tell whether code changed since. A diff that touches only docs, .claude or .github skips the app gates.
#
# Usage: check.sh [app]   (`app` forces the app gates on regardless of the diff)

. "$(dirname "$0")/lib.sh"
CODE="$(current_code)" || die CHECK "not on a ticket branch"
BASE="$(env_get "$CODE" BASE)"; BASE="${BASE:-$TRUNK}"
open_log "$STATE/$CODE/check.log"
cd "$ROOT" || exit 1

CHANGED="$( { git diff --name-only "$(git merge-base "origin/$BASE" HEAD)"; git ls-files -o --exclude-standard; } | sort -u)"
RAN=()

if [ "${1:-}" = app ] || grep -qvE '^(docs/|\.claude/|\.github/|[^/]+\.md$)' <<< "$CHANGED"; then
  if grep -qE '^(package\.json|pnpm-lock\.yaml)$' <<< "$CHANGED"; then
    step CHECK "pnpm install --frozen-lockfile" pnpm install --frozen-lockfile
  fi
  step CHECK "lint" pnpm lint
  step CHECK "typecheck" pnpm typecheck
  step CHECK "build" pnpm build
  RAN+=(lint typecheck build)
fi

working_tree > "$STATE/$CODE/gates.ok"
echo "CHECK PASS: ${RAN[*]:-nothing to check (no app files changed)}"
