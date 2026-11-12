---
name: ticket
description: Take one ticket from GitHub issue to PR in this session. With an issue number, claims and starts that ticket. With `next`, claims the next available ticket (yours first, else the first ready one) and starts it. Claiming assigns you on GitHub and refuses a ticket assigned to anyone else. Without an argument, resumes the current branch's ticket, else shows the board. Scripts handle claiming, branching, gates and shipping; the session spends its effort on the plan and the code.
argument-hint: "[<issue number>|next] [feat|fix|perf|refactor|chore|ci|docs|test|build|style] [--base <branch>]"
disable-model-invocation: true
allowed-tools: Bash(${CLAUDE_SKILL_DIR}/scripts/*)
---

# Ticket

## Board or ticket

!`"${CLAUDE_SKILL_DIR}/scripts/session.sh" $ARGUMENTS`

## Scripts

`$S` is `${CLAUDE_SKILL_DIR}/scripts`. Each script prints one `PASS` line, or `FAIL: <step>` with the tail of its output and a log path. Read the log only when the tail isn't enough. Don't re-run by hand what a script already checked.

| Script | Does |
| --- | --- |
| `$S/status.sh [--next\|--ready]` | The board: in flight, yours, ready, claimed by others, blocked on someone, waiting, parked |
| `$S/start.sh <n> [type] [--base <branch>]` | Claims the ticket and branches `<type>/<n>-<slug>` from `main`, or from the one parent still in review so the PR stacks on it; prints the issue |
| `$S/check.sh [app]` | Lint, typecheck and build, skipped for a docs-only diff; stamps the tree they passed on |
| `$S/ship.sh` | Checks the stamp, the PR title, body and attribution, pushes, and opens or updates the PR |

State (logs, stamp, PR title and body) lives in `.git/ticket/<issue number>/`.

Tickets are GitHub issues in `TandemCreativeDev/cbc`, never files in the repo; the scripts read them with `gh`. [docs/tickets/INSTRUCTIONS.md](../../../docs/tickets/INSTRUCTIONS.md) says how they are shaped, how to verify each kind of acceptance criterion, and what never to touch. Read it before planning.

## If the block above is the board

The user ran `/ticket` with no argument and no ticket branch checked out. Suggest one ticket in one line: one under **Yours** first, else the first **Ready** ticket. Never one under **Claimed by someone else**, **Blocked on someone** or **Parked**. Stop and wait for the user to pick. Then run `$S/start.sh <n>`, with a type when the default (`fix` for bugs, else `feat`) doesn't fit, and carry on below.

## If the block above is `START FAIL` or `NEXT FAIL`

Show the reason and stop. Don't work around a dependency; the user decides whether to pass `--base`. A ticket claimed by someone else is theirs: suggest another, never unassign them.

## Protocol

1. **Read.** The issue is printed above. Read `docs/tickets/INSTRUCTIONS.md`, the files the issue names and the nearest similar code. Invoke the skills INSTRUCTIONS.md lists for the kind of work before writing code that needs them.
2. **Plan checkpoint.** Reply with a short plan and **stop until the user approves it**:
   - each acceptance criterion, with the method that will prove it (INSTRUCTIONS.md §3) and the expected result;
   - the files to create or change, and anything deliberately left out;
   - open questions from the issue that need an answer before coding, and any criterion that can't be proven locally (say what would prove it instead).

   Don't re-plan after approval unless the code proves the plan wrong; then say so and ask.

3. **Build.** Change only the files the plan names. Commit in logical steps with the `commit` skill. No AI attribution.
4. **Check.** Run `$S/check.sh` until it passes. A failing gate is a failed criterion: fix the code. Run it again after any later change.
5. **Prove.** Verify each criterion with its method. Keep the decisive lines of real output; never paraphrase. A negative criterion ("X must fail") needs proof that it fails and that the valid path still works. Check the dev server output for errors. Stop any dev server you started, by port.
6. **Write the PR title and body.** The title goes in `.git/ticket/<issue number>/title`: one line, `<type>(<scope>): <summary>`. The body goes in `.git/ticket/<issue number>/pr.md`, from [pr-template.md](pr-template.md). It is the ticket's report: every criterion has a row, deviations are listed, and anything a person must do after merge (environment variables, Netlify or DNS settings) is spelled out.
7. **Ship.** Run `$S/ship.sh`. It opens or updates the PR, ready for review. Then check the Netlify deploy preview (`gh pr checks`) and re-prove on the preview any criterion INSTRUCTIONS.md says needs the deployed build. Reply with the PR link, the criteria table's results, and anything the user must decide or do. The user merges; never merge.

## Rules

- One ticket per session. If the work reveals another ticket's scope, note it under deviations rather than doing it.
- The hard rules in INSTRUCTIONS.md §5 apply. Breaking one fails the ticket.
- A stacked ticket follows its parent: when the parent changes or merges, rebase with the `gh-stack` skill, then `$S/check.sh` and `$S/ship.sh` again.
- `/tickets` runs the same work through an implementer and a reviewer agent, for one ticket or a queue of them.
