import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_calendar_settings_behaviour_after_end" AS ENUM('open', 'holding');
  CREATE TYPE "public"."enum_calendar_settings_fonts_title" AS ENUM('georgia', 'fraunces', 'goudy-heavyface', 'caprasimo', 'abril-fatface', 'dm-serif-display', 'playfair-display', 'shrikhand', 'alfa-slab-one', 'righteous', 'monoton', 'blanch-caps', 'bebas-neue');
  CREATE TYPE "public"."enum_calendar_settings_fonts_accent" AS ENUM('georgia', 'fraunces', 'dm-serif-display', 'playfair-display', 'damion', 'yellowtail', 'lobster');
  CREATE TYPE "public"."enum_calendar_settings_fonts_body" AS ENUM('system', 'jost', 'dm-sans', 'outfit', 'fraunces');
  CREATE TABLE "calendar_doors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" numeric NOT NULL,
  	"color" varchar,
  	"image_id" integer,
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
  
  CREATE TABLE "calendar_doors_locales" (
  	"title" varchar NOT NULL,
  	"note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "calendar_settings_door_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"door" varchar NOT NULL,
  	"ink" varchar NOT NULL,
  	"locked" varchar NOT NULL
  );
  
  CREATE TABLE "calendar_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"behaviour_visible" boolean DEFAULT false,
  	"behaviour_year" numeric DEFAULT 2026 NOT NULL,
  	"behaviour_opens_at_hour" numeric DEFAULT 0 NOT NULL,
  	"behaviour_after_end" "enum_calendar_settings_behaviour_after_end" DEFAULT 'open' NOT NULL,
  	"colors_paper" varchar,
  	"colors_ink" varchar,
  	"colors_orange" varchar,
  	"colors_quiet" varchar,
  	"colors_border" varchar,
  	"fonts_title" "enum_calendar_settings_fonts_title" DEFAULT 'georgia' NOT NULL,
  	"fonts_accent" "enum_calendar_settings_fonts_accent" DEFAULT 'georgia' NOT NULL,
  	"fonts_body" "enum_calendar_settings_fonts_body" DEFAULT 'system' NOT NULL,
  	"images_background_id" integer,
  	"images_share_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "calendar_settings_locales" (
  	"texts_title" varchar,
  	"texts_accent_line" varchar,
  	"texts_intro" varchar,
  	"texts_date_range" varchar,
  	"texts_footer" varchar,
  	"texts_sound_on" varchar,
  	"texts_sound_off" varchar,
  	"texts_download" varchar,
  	"texts_holding" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "calendar_doors_id" integer;
  ALTER TABLE "calendar_doors" ADD CONSTRAINT "calendar_doors_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "calendar_doors_locales" ADD CONSTRAINT "calendar_doors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."calendar_doors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "calendar_settings_door_colors" ADD CONSTRAINT "calendar_settings_door_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."calendar_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "calendar_settings" ADD CONSTRAINT "calendar_settings_images_background_id_media_id_fk" FOREIGN KEY ("images_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "calendar_settings" ADD CONSTRAINT "calendar_settings_images_share_id_media_id_fk" FOREIGN KEY ("images_share_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "calendar_settings_locales" ADD CONSTRAINT "calendar_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."calendar_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "calendar_doors_day_idx" ON "calendar_doors" USING btree ("day");
  CREATE INDEX "calendar_doors_image_idx" ON "calendar_doors" USING btree ("image_id");
  CREATE INDEX "calendar_doors_updated_at_idx" ON "calendar_doors" USING btree ("updated_at");
  CREATE INDEX "calendar_doors_created_at_idx" ON "calendar_doors" USING btree ("created_at");
  CREATE UNIQUE INDEX "calendar_doors_filename_idx" ON "calendar_doors" USING btree ("filename");
  CREATE UNIQUE INDEX "calendar_doors_locales_locale_parent_id_unique" ON "calendar_doors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "calendar_doors_locales_parent_id_idx" ON "calendar_doors_locales" USING btree ("_parent_id");
  CREATE INDEX "calendar_settings_door_colors_order_idx" ON "calendar_settings_door_colors" USING btree ("_order");
  CREATE INDEX "calendar_settings_door_colors_parent_id_idx" ON "calendar_settings_door_colors" USING btree ("_parent_id");
  CREATE INDEX "calendar_settings_images_images_background_idx" ON "calendar_settings" USING btree ("images_background_id");
  CREATE INDEX "calendar_settings_images_images_share_idx" ON "calendar_settings" USING btree ("images_share_id");
  CREATE UNIQUE INDEX "calendar_settings_locales_locale_parent_id_unique" ON "calendar_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "calendar_settings_locales_parent_id_idx" ON "calendar_settings_locales" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_calendar_doors_fk" FOREIGN KEY ("calendar_doors_id") REFERENCES "public"."calendar_doors"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_calendar_doors_id_idx" ON "payload_locked_documents_rels" USING btree ("calendar_doors_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "calendar_doors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "calendar_doors_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "calendar_settings_door_colors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "calendar_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "calendar_settings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_calendar_doors_fk";
  DROP INDEX "payload_locked_documents_rels_calendar_doors_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "calendar_doors_id";
  DROP TABLE "calendar_doors" CASCADE;
  DROP TABLE "calendar_doors_locales" CASCADE;
  DROP TABLE "calendar_settings_door_colors" CASCADE;
  DROP TABLE "calendar_settings" CASCADE;
  DROP TABLE "calendar_settings_locales" CASCADE;
  DROP TYPE "public"."enum_calendar_settings_behaviour_after_end";
  DROP TYPE "public"."enum_calendar_settings_fonts_title";
  DROP TYPE "public"."enum_calendar_settings_fonts_accent";
  DROP TYPE "public"."enum_calendar_settings_fonts_body";`)
}
