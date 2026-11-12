---
name: tickets
description: Run one ticket or a queue of tickets through an implement, review, fix loop with two agents in separate contexts. cbc-implementer builds each ticket and opens a draft PR, cbc-reviewer reviews it with /pr-review and fixes, and the loop repeats until a review is clean or a guard stops it. Tickets run one at a time in dependency order; a dependent stacks on its parent's PR. With issue numbers, runs those; without, runs the tickets the board shows as ready. Ships each PR ready for review; the user merges.
argument-hint: "[<issue number>...] [--max <n>] [--plan]"
disable-model-invocation: true
allowed-tools: Bash(${CLAUDE_SKILL_DIR}/scripts/*), Bash(${CLAUDE_SKILL_DIR}/../ticket/scripts/*), Agent, SendMessage, AskUserQuestion
---

# Tickets

## Queue and board

!`"${CLAUDE_SKILL_DIR}/scripts/queue.sh" init $ARGUMENTS`

If the block says `QUEUE FAIL`, show the reason and stop. Do nothing else.

## Scripts

`$Q` is `${CLAUDE_SKILL_DIR}/scripts`, `$S` is `.claude/skills/ticket/scripts`. Each prints one `PASS` line or `FAIL: <reason>`.

| Script | Does |
| --- | --- |
| `$Q/queue.sh next` | Starts the first queued ticket that can start (claims it, creates its branch, opens its loop) and prints the issue. Prints `QUEUE DONE` when nothing is left |
| `$Q/queue.sh done <n> <ready\|parked> [note]` | Records how a ticket ended |
| `$Q/queue.sh status` | The queue |
| `$Q/loop.sh phase build` | Records that the plan was approved (`--plan` runs only) |
| `$Q/loop.sh round` | Opens a review round; fails at the cap (3, `TICKET_LOOP_ROUNDS`) |
| `$Q/loop.sh verdict <ALL CLEAR\|NOT CLEAR> [titles]` | Records the verdict and open findings; fails when a finding repeats from the last round |
| `$Q/loop.sh status` | Mode, phase, round, verdicts and findings so far |
| `$S/ship.sh` | Pushes the reviewed branch and marks the draft PR ready (refuses on `NOT CLEAR`) |

State lives in `.git/ticket/`: `queue` for the run, and per ticket `<issue number>/loop`, `round-N.findings`, `title`, `pr.md`, `gates.ok` and `env`.

## Protocol

You drive; the agents do the work. Never implement or review yourself, and never run `check.sh` yourself: a `PASS` an agent reported is settled. One ticket is in flight at a time, on the main checkout.

1. **Next.** Run `$Q/queue.sh next`. On `QUEUE DONE`, go to step 8. Otherwise the block names the ticket, its branch and base, and the loop's mode.
2. **Implementer.** `Agent` with `subagent_type: "cbc-implementer"`, `run_in_background: true`. Brief: the issue number, branch and base from the block, and the mode (`plan-first` or `straight-through`). Add only facts the ticket can't see for itself: a decision the user made in this session, or a gotcha from an earlier ticket's PR in this run. The agent reads the issue and `docs/tickets/INSTRUCTIONS.md` itself.
3. **Plan pause** (`plan-first` only). The implementer returns its plan. Show it to the user verbatim and wait for approval or notes. On approval run `$Q/loop.sh phase build`, then `SendMessage` the implementer with "approved" and any notes.
4. **Reviewer.** When the implementer returns a PR URL: `$Q/loop.sh round`, then `Agent` with `subagent_type: "cbc-reviewer"`, `run_in_background: true`. Brief: the PR number, issue number, branch and base. If the implementer returned `BLOCKED` instead, go to step 7.
5. **Verdict.** The reviewer replies `ALL CLEAR` or `NOT CLEAR` with open findings. Run `$Q/loop.sh verdict "<verdict>" "<title>" …` with the open findings' titles.
   - `ALL CLEAR`: run `$S/ship.sh`. It pushes the reviewer's fixes, updates the PR body with its `## Review` section and marks the PR ready. Then `$Q/queue.sh done <n> ready` and back to step 1.
   - `NOT CLEAR` with **scope** findings: `SendMessage` the implementer with those findings (it keeps its context), wait for it to run `check.sh` and `ship.sh` again, then back to step 4.
   - `NOT CLEAR` with only **decision** findings: go to step 7.
   - `LOOP FAIL` (round cap, or a repeated finding): go to step 7.
6. **Interrupted agents.** Agents die together on usage limits. `$Q/queue.sh status`, `$Q/loop.sh status` and `gh pr view` tell you where it got to; resume at the matching step. Continue an agent you still have the id of with `SendMessage`; otherwise spawn a fresh one and say what is already done.
7. **Park or ask.** A ticket that is `BLOCKED`, not converging, or needs a decision that isn't written down must not stall the run. With more tickets queued: make sure the branch is committed and pushed (continue the agent to do it), run `$Q/queue.sh done <n> parked "<reason>"`, and go back to step 1. With nothing else queued, or when the answer is one line the user can give now: ask the user with the facts (the verdict, the open findings and why they are open, the diagnosis for a `BLOCKED`). Never guess at a decision, and never widen a ticket's scope.
8. **Wind down.** Reply with a short summary: each ticket's PR link and result, the rounds taken, tickets parked and why, tickets still queued and what they wait on, the merges that would unblock the most, and anything the user must decide or do after merge. The user merges; never merge.

## Rules

- A dependent ticket starts only once its parent's PR is ready for review, so the code it builds on has stopped moving. It stacks on the parent's branch. Two unmerged parents means it waits for the user to merge one.
- Scope another ticket reveals goes in the PR body's notes, not into the branch.
- The hard rules in `docs/tickets/INSTRUCTIONS.md` §5 apply to both agents; a reviewer that finds one broken reports it as critical and the loop fixes it like any other finding.
- `/ticket` alone is the same work with you in the implementer's seat and no reviewer; use it for a ticket too small to be worth two agents, or one you want to steer.
