---
name: payload-collection
description: Add or change a Payload collection end to end (config, generated types, migration, proof on a Neon branch) following .claude/rules/database.md. Use when adding a collection, adding, renaming or removing a field, or writing a hand-made constraint or trigger.
---

# Payload Collection

Changes one collection in `src/collections/`, following `.claude/rules/database.md`. Copy the nearest existing collection (`TourDates.ts` for content, `Media.ts` for uploads) and adapt it.

Every Neon command needs the Tandem profile: `export NEON_PROFILE=tandem`. The `--profile` flag alone is not enough for project-scoped commands.

## 0. Read first

- `.claude/rules/database.md`, all of it.
- The Payload docs for each field type you plan to use, through context7 (`/websites/payloadcms`). Field options change between minor versions.
- `.neon` must say `"branch": "dev"`. If not, run `neon checkout dev` before starting the dev server.

## 1. Design

For each piece of data, decide before writing config:

1. Is it derivable? Then it is not a field.
2. Is it translatable text? Then `localized: true`. Dates, URLs, names of places and IDs are not.
3. Does it repeat? Then an `array` field, never delimited text.
4. Does it point at another document? Then one `relationship` or `upload` with a single `relationTo` and no `hasMany`.
5. Is it one of a fixed set? Then `select`.

If the answer needs `json`, `richText`, `blocks`, a polymorphic `relationTo` or a `hasMany` relationship, stop and ask. A yes goes in the register in `database.md`.

## 2. Config

1. Write or edit `src/collections/<Name>.ts`: export a `CollectionConfig` with a plural kebab-case `slug`, `admin.useAsTitle`, explicit `access`, and the fields with `required`, `unique` and `index` set where they hold.
2. A new collection is added to `collections` in `src/payload.config.ts`. An upload collection that stores files is also added to the `s3Storage` plugin's `collections`.
3. Run `pnpm exec payload generate:types`. Run `pnpm exec payload generate:importmap` if the admin gained a custom component.

## 3. Try it on `dev`

1. `pnpm dev --port <4000 + issue number>`. Dev mode pushes the schema to the `dev` branch.
2. In `/admin`, create, edit and delete a document. Read the dev server output for errors.
3. Stop the server by port.

## 4. Migration

1. `pnpm exec payload migrate:create <concern>`.
2. Read the generated SQL in `src/migrations/`. It must contain no `jsonb` column and no `_rels` table for our collections, and each relationship must be a `<field>_id` column with a foreign key.
3. A rename shows up as drop and add, which loses data. Write the `ALTER TABLE … RENAME` by hand in that migration instead and say so in the PR.

## 5. Hand-written objects

Only when a rule must hold for direct SQL too.

1. `pnpm exec payload migrate:create <concern> --force-accept-warning` writes a blank migration. Put the SQL in `up` and its reverse in `down`, using `db.execute(sql\`…\`)`.
2. Functions set `search_path` explicitly and are not `SECURITY DEFINER` unless they must be.
3. Add the object to the register in `database.md`.

## 6. Apply to `preview` and prove

1. Pull the `preview` branch's variables to a file outside the working tree: `neon env pull --branch preview --file .git/ticket/<issue number>/artefacts/preview.env`. Never print it.
2. With `.env.local` and then that file loaded into the shell, run `pnpm exec payload migrate`.
3. Prove with SQL through `neon psql preview -- -Atc "<query>"`: the table and columns exist, valid data passes, and each constraint rejects what it guards against. Keep the output for the PR.
4. After the PR's deploy preview is ready, create a document in the preview's admin and load the page that shows it.

## 7. Production

Never run a migration against `main`. List the step in the PR's notes for the user: `payload migrate` against the `main` branch, and any environment variable the change needs.

## 8. Using the content

- Server components read with `getPayload({ config })` and `payload.find`, passing the visitor's locale and `fallbackLocale: 'en'`.
- Types come from `src/payload-types.ts`. Never write a type by hand for collection data.
- With `cacheComponents` on, a read is either inside `"use cache"` with a `cacheTag`, or inside `<Suspense>` after `await connection()`. Invoke `vercel:next-cache-components` first.
