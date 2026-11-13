---
paths:
  - "src/collections/**"
  - "src/payload.config.ts"
  - "src/migrations/**"
---

# Database Rules

Payload generates the Postgres schema from the collection config in `src/collections/`. The schema is designed by choosing fields, not by writing tables. These rules are non-negotiable. A PR that breaks one is rejected.

## Ownership

- **Payload owns** the `payload_*` tables (`payload_migrations`, `payload_preferences`, `payload_locked_documents`, `payload_kv` and their `_rels`), `users_sessions`, and the `id`, `created_at` and `updated_at` columns on every table. Never write to them, alter them or query them from site code. They hold `jsonb` and generic `_rels` joins; that is Payload's business and exempt from the rules below.
- **We own** every collection: its fields, names, constraints and access.
- Read and write through Payload's local API (`getPayload`, `payload.find`). Reach for `payload.db.drizzle` only for a query the local API cannot express, and say why in the PR.

## Normalisation

- **3NF.** Every field depends on the document it sits on, the whole document and nothing but the document.
- **Don't store anything derivable.** Whether a tour date is past or upcoming comes from `eventDate` at render time. An embed URL comes from the stored ID. Never add a field the page can compute.
- **Atomic columns only.** These field types are banned in our collections:
  - `json`: one `jsonb` column.
  - `richText`: Lexical state, one `jsonb` column. Use `textarea` for multi-line copy and lyrics.
  - `blocks`: one table per block type hanging off one field, a polymorphic list. Never set `blocksAsJSON` on the adapter either.
  - `point`: a PostGIS `geometry` column holding two values.
  - `hasMany` on `text` or `number`: stored in generic `<collection>_texts` and `<collection>_numbers` tables keyed by a text `path`. Use an `array`.
  - Any delimited or encoded text (no "a,b,c" in a `text` field).
- **Repeating data** is an `array` field. Payload stores it as a child table `<collection>_<field>` keyed by parent and order, with a real foreign key.
- **Controlled redundancy** is allowed only when the database keeps it consistent, through a constraint or trigger in a hand-written migration. Site code never syncs a redundant value. Every case goes in the register at the end of this file.

## Relationships

- **No polymorphic relationships.** `relationTo` is always one collection slug, never an array.
- **No `hasMany` on `relationship` or `upload` fields.** Payload stores those in a generic `<collection>_rels` table with one nullable column per target and a text `path`, so nothing guarantees a row points where the field says. For many-to-many, use an `array` field holding one single `relationship`, or a join collection with two single relationships.
- A single `relationship` or `upload` becomes a `<field>_id` column with a foreign key. That is the only shape we use.
- Check the generated migration: a `_rels`, `_texts` or `_numbers` table for one of our collections means a rule was broken.

## Languages

- The site is English and French. Translatable text uses Payload localisation: `localization: { locales: ['en', 'fr'], defaultLocale: 'en', fallback: true }` in the config and `localized: true` on the field. Payload moves those columns to `<collection>_locales`, one row per document per locale.
- Never pair fields by language (`titleEn` and `titleFr`, `lyrics` and `paroles`).
- Language-neutral data stays unlocalised: dates, URLs, venue and city names, embed IDs, images.
- Read with the visitor's locale and `fallbackLocale: 'en'`.

## Enums, lookups and checks

- A fixed option set that carries only a name is a `select` field. Payload creates a Postgres enum `enum_<collection>_<field>`; changing the options needs a migration. `hasMany` on a `select` is fine: it becomes a child table of enum values.
- A lookup is its own collection, and only when the options carry extra attributes or editors must add options without a deploy. State the reason in the PR.
- `required`, `unique` and `index` on a field become `NOT NULL`, a unique index and an index. Use them; they are the first line of integrity.
- Two cases drop the `NOT NULL` silently: a collection with `versions.drafts` on (every required column becomes nullable, because a draft may be incomplete) and a required field with `admin.condition`. Don't put `admin.condition` on a required field. Turning drafts on is a departure: record it in the register.
- Numeric ranges and cross-field rules that must hold for direct SQL too go in a `CHECK` constraint in a hand-written migration. Rules that only shape editor input go in the field's `validate`.

## Naming

- Collection slugs are plural kebab-case (`tour-dates`); Payload snake-cases them for tables. Field names are camelCase.
- Don't set `dbName` unless a generated name exceeds Postgres's 63 characters.
- IDs are Payload's default serial integers. Don't switch `idType` once data exists.

## Access

- Every collection declares `access.read` explicitly, so who can read it is visible in the file. Payload's access functions are the only row-level security here.
- `read: () => true` only for content the public site shows; otherwise `read: ({ req }) => Boolean(req.user)`. Leave `create`, `update` and `delete` unset: Payload's default is signed-in users only.
- The `users` collection is never publicly readable.

## Migrations

- `src/migrations/` is written by `pnpm exec payload migrate:create <concern>` and applied by `pnpm exec payload migrate`. One concern per migration.
- Read the generated SQL before committing it. Reject `jsonb` and `geometry` columns and `_rels`, `_texts` and `_numbers` tables on our collections.
- Hand-written SQL (triggers, functions, `CHECK` constraints, partial indexes) goes in its own blank migration: `pnpm exec payload migrate:create <concern> --force-accept-warning`, run when no config change is pending (otherwise the file is not blank). Never mix it into a generated one. The one exception is a rename: Payload generates a drop and an add, which loses data, so replace those statements with `ALTER TABLE … RENAME` in the generated file and say so in the PR. Payload's generator does not know these objects exist, so a later rename can orphan them: list each one in the register below.
- Never edit a migration after it has merged. A migration must work with the previous deploy still running.
- `pnpm dev` pushes the schema straight to whatever `DATABASE_URL` points at. `.env.local` must point at the Neon `dev` branch, never `preview` or `main`. Those two change only through `payload migrate`.
- `src/payload-types.ts` and `src/app/(payload)/admin/importMap.js` are generated. Regenerate (`payload generate:types`, `payload generate:importmap`); never hand-edit. The other files in `src/app/(payload)/` were copied in once from Payload's template and are left alone, except `custom.scss`, which is ours to edit. Derive every content type in site code from `payload-types.ts`.

## Uploads

- Files live in Neon Object Storage through `@payloadcms/storage-s3`; the `media` table holds the key and metadata, never the bytes.
- Storage branches with the database. A file uploaded on `preview` does not exist on `main`.

## Proof

There is no test framework. Every constraint, trigger and hand-written index is proven on the Neon `preview` branch with SQL (the `db` method in `docs/tickets/INSTRUCTIONS.md` §3), after `payload migrate` has applied it there: show that valid data passes and that the misuse it guards against fails. The `dev` branch cannot be used for this: it only ever receives dev-mode pushes, so migrations never run on it.

## Register of departures

Every denormalisation, banned field type used anyway, and hand-written database object, with its reason and the migration that holds it.

| Object | Kind | Reason | Migration |
| --- | --- | --- | --- |
| `calendar_doors_day_range_check` | CHECK constraint | A door's day is 1 to 24 for direct SQL too | `20261112_232323_calendar_checks` |
| `calendar_settings_opens_at_hour_range_check` | CHECK constraint | The opening hour is 0 to 23 for direct SQL too | `20261112_232323_calendar_checks` |
