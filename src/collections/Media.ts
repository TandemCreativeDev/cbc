import type { CollectionConfig } from "payload";
import { jpegQuality, maxImageSide } from "../lib/payload/imageLimits";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "compression",
      type: "ui",
      admin: {
        components: {
          Field: "/components/payload/ImageCompressor#ImageCompressor",
        },
      },
    },
  ],
  upload: {
    mimeTypes: ["image/*"],
    resizeOptions: {
      width: maxImageSide,
      height: maxImageSide,
      fit: "inside",
      withoutEnlargement: true,
    },
    formatOptions: {
      format: "jpeg",
      options: { quality: jpegQuality, progressive: true },
    },
  },
};
