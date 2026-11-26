import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "calendar_doors" DROP COLUMN "color";
  ALTER TABLE "calendar_settings_locales" DROP COLUMN "texts_download";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "calendar_doors" ADD COLUMN "color" varchar;
  ALTER TABLE "calendar_settings_locales" ADD COLUMN "texts_download" varchar;`)
}
