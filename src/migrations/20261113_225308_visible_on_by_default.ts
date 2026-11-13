import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "calendar_settings" ALTER COLUMN "behaviour_visible" SET DEFAULT true;
  UPDATE "calendar_settings" SET "behaviour_visible" = true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "calendar_settings" ALTER COLUMN "behaviour_visible" SET DEFAULT false;
  UPDATE "calendar_settings" SET "behaviour_visible" = false;`)
}
