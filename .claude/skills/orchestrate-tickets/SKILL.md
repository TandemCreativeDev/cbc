---
name: orchestrate-tickets
description: Run several tickets in parallel, each in its own git worktree, through cbc-implementer and cbc-reviewer agents. Keeps up to --parallel tickets in flight, spawns a reviewer as each implementer opens its draft PR, ships each PR ready for review once a review is clean, and starts dependents as soon as their parent is ready for review, stacked on it. With --merge, squash-merges each PR itself once the review is clean, every check is green and the deploy preview serves the site, and dependents start from main after their parent merges. With issue numbers, runs those; without, runs the tickets the board shows as ready. Writes the handover to PROMPT.md at the end.
argument-hint: "[<issue number>...] [--parallel <n>] [--max <n>] [--plan] [--merge]"
disable-model-invocation: true
allowed-tools: Bash(${CLAUDE_SKILL_DIR}/scripts/*), Bash(gh issue view:*), Bash(gh pr view:*), Bash(gh pr checks:*), Bash(git -C:*), Bash(curl -sI:*), Agent, SendMessage, AskUserQuestion
---

# Orchestrate tickets

## Run, board and handover

!`"${CLAUDE_SKILL_DIR}/scripts/run.sh" init $ARGUMENTS`

If the block says `ORCH FAIL`, show the reason and stop. Do nothing else.

## Scripts

`$R` is `${CLAUDE_SKILL_DIR}/scripts/run.sh`. Each command prints one `PASS` line or `FAIL: <reason>`.

| Command | Does |
| --- | --- |
| `$R ready` | Queued tickets that can start now (`READY`), why the others wait, and the free slots. Prints `RUN DONE` when nothing is queued or in flight |
| `$R launch <n>` | Marks a startable ticket started (refuses when every slot is in use or it can't start) and prints the implementer's setup command, mode and port |
| `$R loop <n> round` | Opens a review round; fails at the cap (3, `TICKET_LOOP_ROUNDS`) |
| `$R loop <n> verdict <ALL CLEAR\|NOT CLEAR> [titles]` | Records the verdict and open findings; fails when a finding repeats from the last round |
| `$R loop <n> phase build` | Records that the plan was approved (`--plan` runs only) |
| `$R ship <n>` | `ship.sh` in the ticket's worktree: pushes the reviewed branch, updates the PR body and marks the draft ready (refuses on `NOT CLEAR`) |
| `$R merge <n>` | `--merge` runs only, after `ship`: refuses unless the verdict is `ALL CLEAR`, the PR targets `main`, is pushed and free of attribution and conflicts; waits for every check to pass, gets a 200 from the deploy preview's main pages (`ORCH_PREVIEW_PATHS`), squash-merges, deletes the branch, frees the worktree and fast-forwards `main` |
| `$R done <n> <ready\|parked> [note]` | Records how a ticket ended, stops its dev server and frees its worktree once it is clean and pushed |
| `$R status` | Every ticket in the run: state, worktree, branch, PR, phase, round and verdict |

`$R setup <n>` is the implementer's, not yours. State is in `.git/ticket/`: `orchestrate` (the run) and `orchestrate.conf`, then per ticket the same files `/tickets` keeps, plus `WORKTREE` in `env`. Worktrees live in `.claude/worktrees/`, git-ignored locally.

## Protocol

You drive; the agents do the work. Never implement, review, run `check.sh` or edit a worktree yourself: a `PASS` an agent reported is settled. The main checkout is yours and stays as it is.

1. **Resume.** For each `started` ticket in the block's **Run** section:
   - verdict `ALL CLEAR`: step 6;
   - PR open, no verdict, round 0: step 5;
   - worktree with commits but no PR, or no worktree yet: continue its implementer with `SendMessage` if you still have its id; otherwise spawn a new one as in step 3 (`$R launch <n>` reprints the setup command, and `setup` moves the branch out of the old worktree into the new one).
2. **Fill slots.** Read `$R ready`. For each `READY` ticket, while slots are free, lowest number first:
   - Don't run two tickets at once that change the Payload schema or migrations (both push to the Neon `dev` branch), `package.json`/`pnpm-lock.yaml`, `netlify.toml`, or the same files the issues name. Read both issues (`gh issue view <n>`) when in doubt; the later one waits.
   - Run `$R launch <n>`.
3. **Implementer.** `Agent` with `subagent_type: "cbc-implementer"`, `isolation: "worktree"`, `run_in_background: true`. Brief:
   - the issue number, the mode, and "You are in your own worktree. Run `<setup command>` first: it claims the ticket, creates its branch, copies the env files, installs and prints the issue";
   - only facts the ticket can't see for itself: a decision the user made in this session, or a contract or gotcha from a parent's PR in this run.
   Launch every free slot's implementer in one message.
4. **Plan pause** (`plan-first` only). As each plan comes back, show it to the user verbatim with its issue number and wait for approval or notes. On approval run `$R loop <n> phase build`, then `SendMessage` the implementer "approved" and the notes. Other tickets carry on meanwhile.
5. **Reviewer.** When an implementer returns a PR URL: `$R loop <n> round`, then `Agent` with `subagent_type: "cbc-reviewer"`, `run_in_background: true` (no isolation). Brief: the PR number, issue number, branch, base, and "Work only in the worktree `<path>`: start every Bash command with `cd <path> && `." `$R status` has the path. If the implementer returned `BLOCKED`, go to step 8.
6. **Verdict.** Run `$R loop <n> verdict "<verdict>" "<title>" …` with the open findings' titles.
   - `ALL CLEAR`: `$R ship <n>`, then `$R done <n> ready`. Its dependents may now be `READY`: back to step 2.
   - `ALL CLEAR` in a `merge on` run: `$R ship <n>`, then `$R merge <n>` with `run_in_background: true` (it waits for the checks). Before merging the next PR, confirm the last merge's Netlify production deploy is published (INSTRUCTIONS.md §7) and `curl -sI https://clarksbowlingclub.com` answers 200; if production broke, stop merging and tell the user. Its dependents may now be `READY`: back to step 2.
   - `MERGE FAIL`: a conflict or a moved head goes back to the reviewer (rebase onto `main`, `check.sh`, `ship.sh`), then retry. A failed check or a preview that doesn't answer: retry once if it looks transient (a timed-out build, a dropped connection), otherwise send the failure to the reviewer. Never merge around a failure.
   - `NOT CLEAR` with **scope** findings: `SendMessage` the implementer the findings (it keeps its context); when it has run `check.sh` and `ship.sh` again, back to step 5.
   - `NOT CLEAR` with only **decision** findings, or `LOOP FAIL`: step 8.
7. **Keep moving.** Never idle while a slot is free and a ticket is `READY`. A notification that an agent "is waiting on its own background work" is not a hand-back. When an agent has been quiet for about 20 minutes, check its work yourself (`git -C <worktree> log`, `gh pr view`, `$R loop <n> status`); `SendMessage` it to finish and hand back. Agents die together on usage limits: `$R status` shows what survived, then resume as in step 1.
8. **Park or ask.** A ticket that is `BLOCKED`, not converging, or needs a decision that isn't written down must not stall the others. Make sure its branch is committed and pushed (continue an agent to do it), run `$R done <n> parked "<reason>"`, and carry on. Ask the user when nothing else can run, or when the answer is one line they can give now: the verdict, the open findings and why they are open, the diagnosis for a `BLOCKED`. Never guess at a decision, and never widen a ticket's scope.
9. **Wind down** when `$R ready` prints `RUN DONE`, or only parked and waiting tickets are left:
   - Update `PROMPT.md` (git-ignored, never committed) in place: **Where we are** (date, PRs ready for review and what each unblocks, anything parked and why), the next ticket to start, decisions and gotchas later tickets need, and open questions. Merge into existing entries; don't append a diary.
   - Reply with a short summary: each ticket's PR link and result, rounds taken, tickets parked and why, tickets still queued and what they wait on, the merges that would unblock the most, and anything the user must decide or do after merge. Without `--merge` the user merges; never merge.

## Rules

- A dependent starts only once its parent's PR is ready for review, so the code it builds on has stopped moving; it stacks on the parent's branch. Two unmerged parents means it waits for the user to merge one. In a `merge on` run there is no stacking: a dependent waits until its parent has merged and starts from `main`. `$R ready` enforces all of this.
- Only you merge, only with `$R merge`, and only in a run started with `--merge`. Agents never merge, and nobody pushes to `main`.
- When a parent changes or merges under a stacked child still in flight, send the child's reviewer (or implementer) to rebase with the `gh-stack` skill, then `check.sh` and `ship.sh`.
- Every push costs a Netlify build on the free plan, and parallel agents multiply Google Sheet requests (INSTRUCTIONS.md §4). Keep `--parallel` at 3 or below unless the user asks.
- The hard rules in `docs/tickets/INSTRUCTIONS.md` §5 apply to every agent; a reviewer that finds one broken reports it as critical and the loop fixes it like any other finding.
- `/tickets` is the same loop one ticket at a time on the main checkout; `/ticket` is one ticket in your own session.
