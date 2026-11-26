import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "audio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "audio_id" integer;
  ALTER TABLE "calendar_settings" ADD COLUMN "opening_sound_id" integer;
  CREATE INDEX "audio_updated_at_idx" ON "audio" USING btree ("updated_at");
  CREATE INDEX "audio_created_at_idx" ON "audio" USING btree ("created_at");
  CREATE UNIQUE INDEX "audio_filename_idx" ON "audio" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audio_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."audio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "calendar_settings" ADD CONSTRAINT "calendar_settings_opening_sound_id_audio_id_fk" FOREIGN KEY ("opening_sound_id") REFERENCES "public"."audio"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_audio_id_idx" ON "payload_locked_documents_rels" USING btree ("audio_id");
  CREATE INDEX "calendar_settings_opening_sound_idx" ON "calendar_settings" USING btree ("opening_sound_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "audio" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "audio" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_audio_fk";
  
  ALTER TABLE "calendar_settings" DROP CONSTRAINT "calendar_settings_opening_sound_id_audio_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_audio_id_idx";
  DROP INDEX "calendar_settings_opening_sound_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "audio_id";
  ALTER TABLE "calendar_settings" DROP COLUMN "opening_sound_id";`)
}
