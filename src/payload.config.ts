import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Media } from "./collections/Media";
import { TourDates } from "./collections/TourDates";
import { Users } from "./collections/Users";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const bucket = process.env.S3_BUCKET ?? "";
const endpoint =
  process.env.S3_ENDPOINT ?? process.env.AWS_ENDPOINT_URL_S3 ?? "";

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: dirname,
    },
  },
  collections: [Users, Media, TourDates],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            `${endpoint}/${bucket}/${prefix ? `${prefix}/` : ""}${filename}`,
        },
      },
      bucket,
      config: {
        endpoint,
        region: process.env.S3_REGION ?? process.env.AWS_REGION,
        forcePathStyle: true,
        credentials: {
          accessKeyId:
            process.env.S3_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID ?? "",
          secretAccessKey:
            process.env.S3_SECRET_ACCESS_KEY ??
            process.env.AWS_SECRET_ACCESS_KEY ??
            "",
        },
      },
    }),
  ],
});
