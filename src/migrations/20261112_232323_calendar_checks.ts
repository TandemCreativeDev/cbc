import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "calendar_doors" ADD CONSTRAINT "calendar_doors_day_range_check" CHECK ("day" BETWEEN 1 AND 24);
    ALTER TABLE "calendar_settings" ADD CONSTRAINT "calendar_settings_opens_at_hour_range_check" CHECK ("behaviour_opens_at_hour" BETWEEN 0 AND 23);
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "calendar_settings" DROP CONSTRAINT "calendar_settings_opens_at_hour_range_check";
    ALTER TABLE "calendar_doors" DROP CONSTRAINT "calendar_doors_day_range_check";
  `)
}
