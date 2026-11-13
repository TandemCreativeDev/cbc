import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_page_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"photo_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page_carousel_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "about_page_carousel" ADD CONSTRAINT "about_page_carousel_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_carousel" ADD CONSTRAINT "about_page_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_carousel_locales" ADD CONSTRAINT "about_page_carousel_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_carousel"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_page_carousel_order_idx" ON "about_page_carousel" USING btree ("_order");
  CREATE INDEX "about_page_carousel_parent_id_idx" ON "about_page_carousel" USING btree ("_parent_id");
  CREATE INDEX "about_page_carousel_photo_idx" ON "about_page_carousel" USING btree ("photo_id");
  CREATE UNIQUE INDEX "about_page_carousel_locales_locale_parent_id_unique" ON "about_page_carousel_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_carousel_locales_parent_id_idx" ON "about_page_carousel_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about_page_carousel" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_carousel_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "about_page_carousel" CASCADE;
  DROP TABLE "about_page_carousel_locales" CASCADE;`)
}
