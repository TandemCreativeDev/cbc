# Ticket instructions

The shared reference for anyone, person or agent, taking a ticket in this repo. The roles live elsewhere:

- `/ticket` (`.claude/skills/ticket/SKILL.md`): one ticket, in your own session, with a plan checkpoint.
- `/tickets` (`.claude/skills/tickets/SKILL.md`): one ticket or a queue of them, each through an implementer and a reviewer agent.
- `/orchestrate-tickets` (`.claude/skills/orchestrate-tickets/SKILL.md`): the same loop with several tickets in flight at once, each in its own worktree under `.claude/worktrees/`.
- Implementer: `.claude/agents/cbc-implementer.md` (Sonnet). Reviewer: `.claude/agents/cbc-reviewer.md` (Opus, reviews with the `pr-review` skill).

What to build is in the ticket. How the code should look is in the code that is already here: follow the nearest similar file. Don't restate either in PR bodies or code comments.

## 1. Where the tickets are

Tickets are GitHub issues in [`TandemCreativeDev/cbc`](https://github.com/TandemCreativeDev/cbc/issues). There are no ticket files in the repo. Read one with `gh issue view <n>`; see the board with `/ticket` or `.claude/skills/ticket/scripts/status.sh`.

The scripts rely on this shape:

| Part of the issue | Meaning |
| --- | --- |
| `## Acceptance criteria` | The checklist a PR must prove, one row each in the PR body |
| `## Depends on` | The first line lists the tickets that must be closed, or in review, before this one starts, as `#<n>` refs. Later lines are notes, not dependencies |
| `## Blocked on` | A person has to supply something first. The ticket is shown on the board but never picked automatically |
| `bug` label | The branch type defaults to `fix`; otherwise `feat` |
| `parked` label | Not planned. Never listed as ready and never started |
| Assignee | The claim. Starting a ticket assigns you; a ticket assigned to someone else is refused |

A ticket is in flight when an open PR's branch starts with its number: `<type>/<n>-<slug>`. A callout at the top of an issue (`[!IMPORTANT]`, `[!CAUTION]`, `[!NOTE]`) carries a deadline, a security flag or a decision; read it before anything else.

When a ticket and this file disagree, this file wins. When the ticket contradicts the repo or needs a decision that isn't written down, stop and ask; don't guess.

## 2. Scripts

`$S` is `.claude/skills/ticket/scripts`, `$Q` is `.claude/skills/tickets/scripts`. Each prints one `PASS` line, or `FAIL: <step>`, the last lines of output and the path of the full log. Read the log only when the tail isn't enough.

| Script | Who runs it | What it does |
| --- | --- | --- |
| `$S/status.sh` | anyone | The board |
| `$S/start.sh <n>` | `/ticket`, `/tickets` | Claims the ticket, creates its branch from `main` or from the one parent still in review, prints the issue |
| `$S/check.sh` | implementer, reviewer | `pnpm lint`, `pnpm typecheck`, `pnpm build`; stamps the tree they passed on. Skips for a docs-only diff |
| `$S/ship.sh` | implementer, `/tickets` driver | Refuses unless the tree is committed, the stamp is current and the PR title and body are clean; pushes and opens or updates the PR |
| `$S/stop-check.sh` | the implementer's Stop hook | Blocks finishing until the PR is open, pushed, checked and free of attribution |
| `$Q/queue.sh`, `$Q/loop.sh` | `/tickets` driver | The run's queue, and each ticket's review rounds and verdicts |

State lives in `.git/ticket/`, outside the working tree: per ticket, `env` (the base branch), `check.log`, `gates.ok`, `title`, `pr.md`, and the loop files.

## 3. Verification

`$S/check.sh` must pass before criteria are verified and before every push. Then prove each acceptance criterion by running the thing. Pick the method from what the criterion says:

| Method | When | How | Evidence to keep |
| --- | --- | --- | --- |
| `browser` | Anything a visitor sees or does | An isolated headless Playwright script against your dev server, or the Playwright tools: navigate, snapshot, interact, read console messages. Screenshot anything visual at 1280px and 390px, in English and French (`?isFrench=false`, `?isFrench=true`) | The snapshot excerpt or screenshot path, and console errors (none allowed unless the criterion says so) |
| `api` | Route handlers: `/api/*`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/*.md` | `curl -i` against your dev server | The command, the status line and the relevant headers and body |
| `cli` | A command's result | Run it | The command, its output and exit code |
| `code` | A structural rule ("no request to X", "no hard-coded Y") | `grep` or reading | The command and its output |
| `deploy` | Anything that depends on Netlify: headers, caching, redirects, functions, environment variables, images, the adapter | The PR's deploy preview, `https://deploy-preview-<PR number>--clarksbowlingclub.netlify.app`, once `gh pr checks` shows it ready | The URL, the command and its output |
| `db` | Payload and Postgres | SQL on the Neon `dev` or `preview` branch (`neon psql <branch> -- -Atc "<query>"`), never `main` | The SQL and its output |
| `mail` | The contact form | A local SMTP catcher in place of the real mailbox (§4) | The captured message's headers and body |

Rules:

- Evidence is real output, trimmed to the decisive lines. Never paraphrase it.
- A negative criterion ("X must fail", "X is rejected") needs proof that it fails and that the valid path still works.
- A criterion that says the page looks the same as before needs a before and after screenshot, taken from production or `main` and from your branch.
- A criterion about production (a Lighthouse score on the live site, a DNS record, a setting in a dashboard) can't be proven from a branch. Say so in the plan, prove what you can on the preview, and list the production step in the PR's notes for the user.
- Before reporting, read your dev server's output for errors and warnings.

## 4. Local environment

One checkout, one ticket in flight at a time, except under `/orchestrate-tickets`: there each ticket has its own worktree, with its own `node_modules` and a copy of `.env.local`, and the per-ticket port keeps dev servers apart.

| Item | Value |
| --- | --- |
| Package manager | pnpm. Never npm or yarn |
| Dev server | `pnpm dev --port <4000 + issue number>`, e.g. ticket 27 uses 4027. Run it in the background and stop it when you're done |
| The user's own server | Port 3000 belongs to the user. Never use it, never stop it |
| Env file | `.env.local` in the repo root. Read variable names only. Once Payload lands (#33), its `DATABASE_URL` must point at the Neon `dev` branch, because `pnpm dev` will push the Payload schema to it |
| Content | Payload when `DATABASE_URL` is set (`src/lib/data/payload.ts`), otherwise the published Google Sheet (`src/lib/data/sheet.ts`). Production reads the sheet until the switchover in #33. Local storage variables are `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` and `S3_BUCKET`; `neon checkout` writes Neon's `AWS_*` names, so copy them across. `pnpm content:import` and `pnpm content:compare` run against whatever `DATABASE_URL` points at |
| Artefacts | Screenshots, logs and scratch scripts go in `.git/ticket/<issue number>/artefacts/`, never in the working tree |

Rules:

- Stop only your own dev server, by port: `lsof -tiTCP:<port> -sTCP:LISTEN | xargs kill`. Never `pkill`.
- Never print `.env.local` or any secret, and never commit one.
- The Google Sheet throttles: a burst of requests made it stop answering for about 15 minutes on 11 November 2026, and pages sat on "Loading...". Load pages that read it as few times as you need, and don't script loops against it.
- The contact form sends real email through the band's mailbox. Never submit it against production. To test it locally, start the dev server with `EMAIL_HOST`, `EMAIL_PORT` and `EMAIL_SECURE` overridden in the shell to point at a local SMTP catcher (for example `maildev`), and read the message there.
- Parallel sessions share the Playwright browser tab; prefer an isolated headless script.

## 5. Hard rules

Any one of these broken fails the ticket.

- Never push to `main`, never force-push a branch someone else has pushed to. The one exception is the `/tickets` or `/orchestrate-tickets` driver: it may commit and push its own fixes to the ticket tooling (`.claude/`, `docs/tickets/`) straight to `main` as it goes, never site code.
- Agents never merge a PR. A driver may squash-merge one only when its review verdict is `ALL CLEAR`, every check on the PR is green and the deploy preview serves the site: `/orchestrate-tickets --merge` does this with `run.sh merge`. Otherwise the user merges.
- No AI attribution anywhere: commit messages, PR titles, PR bodies, code comments.
- Commits are single-line `<type>(<scope>): <summary>`, one concern each. PR titles have the same shape.
- No `any` types. Derive types from existing ones or from a schema.
- No new dependency unless the ticket names it or the plan was approved with it.
- No change to production: Netlify site settings, environment variables, DNS, the live Google Sheet, the production database. A ticket that needs one lists the exact step in the PR's notes for the user.
- No real email, and no request to the band's private Prises tool on ChatGPT's hosting.
- Stay inside the ticket. Scope another ticket reveals goes in the PR's notes.

## 6. Skills by kind of work

Invoke the skill before writing code that needs it.

| Work | Skill |
| --- | --- |
| Any commit | `commit` |
| Next.js routing, rendering, caching | `vercel:nextjs`, `vercel:next-cache-components` |
| `netlify.toml`, redirects, headers, environment variables | `netlify-skills:netlify-config`, `netlify-skills:netlify-frameworks` |
| Netlify functions, caching, image CDN | `netlify-skills:netlify-functions`, `netlify-skills:netlify-caching`, `netlify-skills:netlify-image-cdn` |
| Neon Postgres and object storage | `neon:neon-postgres`, `neon:neon-object-storage` |
| A Payload collection, field or migration | `payload-collection` (rules in `.claude/rules/database.md`) |
| Zod schemas | `zod4` |
| A stacked branch that needs rebasing | `gh-stack` |
| New or reshaped UI | `frontend-design:frontend-design` |

Library APIs move fast here (Next 16, Tailwind 4, Payload 3). Look up current documentation with the context7 tools before relying on memory.

## 7. Platform

The Netlify, Neon and GitHub tools are installed and signed in. Use them to find things out; never ask the user for a log, a deploy status or a variable name you can read yourself.

| Thing | Value |
| --- | --- |
| Repository | `TandemCreativeDev/cbc`, public, default branch `main` |
| Hosting | Netlify, site `clarksbowlingclub` (`e11aa02e-0aa1-4177-b5c3-8cf1dc03ddb9`), team "Mandem from Tandem", legacy free plan |
| Production | `https://clarksbowlingclub.com`, deployed from `main` |
| Deploy previews | One per PR, at `https://deploy-preview-<PR number>--clarksbowlingclub.netlify.app`. `gh pr checks <branch>` shows when it is ready |
| Build | `@netlify/plugin-nextjs`; settings are in the Netlify UI until `netlify.toml` lands (#26) |
| Free plan limits | 100 GB bandwidth, 300 build minutes and 125,000 function calls a month. Each push to a PR costs a build, so push as few times as you can |
| Environment variables | All contexts: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASSWORD` (secret), `SHEET_CSV_URL` (server-only; it replaced `NEXT_PUBLIC_CSV_URL` in #27). Deploy previews only, until the migration: `DATABASE_URL`, `PAYLOAD_SECRET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` (secrets), `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`. Netlify reserves the `AWS_*` names, so Neon's storage credentials are stored as `S3_*` |
| Database | Neon project `cbc` (`damp-truth-56586096`), Frankfurt, free plan, in the Tandem Neon account: run Neon commands with `NEON_PROFILE=tandem`. Branches: `main` (production, empty until the migration), `preview` (shared by every deploy preview), `dev` (local). Bucket `media` on each branch. Spiked in #32; migration in #33 |

Reads are always fine: deploy logs (`netlify api getDeploy`, `listSiteDeploys`), variable names, DNS lookups. Anything that changes a hosted service needs the user's approval first; agents ask the `/tickets` driver, and the driver asks the user. The one standing exception is the Neon `dev` and `preview` branches: a ticket may push schema to `dev`, run `payload migrate` on `preview` and create test content on either. Resetting or deleting a branch still needs approval, and `main` is never written.

## 8. The codebase in brief

- Next.js 16 App Router, React 19, TypeScript 6, Tailwind 4 (theme in `src/app/(frontend)/globals.css`, no config file), ESLint 10.
- Each route is `src/app/(frontend)/<route>/page.tsx` (metadata and server data from `src/lib/data/`) plus `_components/<Route>Client.tsx`. `robots.ts`, `sitemap.ts` and `favicon.ico` stay at `src/app/`. Shared UI is in `src/components/`, hooks and helpers in `src/utils/`.
- The site is bilingual. `useLanguage()` from `src/context/LanguageContext.tsx` gives `isFrench`; every visible string has both languages.
- Accessibility was audited to WCAG 2.1 AA: keep live regions, focus management, reduced-motion paths and labels working when you change a component.
- Derive values during render rather than copying them into state with an effect; the lint rules enforce it. `useIsMounted` and `usePrefersReducedMotion` in `src/utils/` cover the common cases.
- There are no unit or end-to-end tests. Don't add a test framework unless a ticket asks; prove criteria by running the thing.
