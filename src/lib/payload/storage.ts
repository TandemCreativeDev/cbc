import { s3Storage } from "@payloadcms/storage-s3";

const bucket = process.env.S3_BUCKET ?? "";
const endpoint = process.env.S3_ENDPOINT ?? "";

const config = {
  endpoint,
  region: process.env.S3_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  },
};

export const storagePlugin = s3Storage({
  collections: {
    media: {
      disablePayloadAccessControl: true,
      generateFileURL: ({ filename, prefix }) =>
        `${endpoint}/${bucket}/${prefix ? `${prefix}/` : ""}${filename}`,
    },
  },
  bucket,
  config,
});

/**
 * Private bucket: files are only served by Payload's access-checked handler.
 * Demos upload straight from the browser, because Netlify refuses request bodies over about 4.6 MB;
 * the bucket needs a CORS rule allowing PUT from the site's origin.
 */
export const demosStoragePlugin = s3Storage({
  clientUploads: true,
  collections: { "calendar-doors": true },
  bucket: process.env.S3_DEMOS_BUCKET ?? "demos",
  config,
});
