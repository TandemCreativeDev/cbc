import type { CollectionConfig } from "payload";

export const Audio: CollectionConfig = {
  slug: "audio",
  admin: {
    useAsTitle: "filename",
    description: "Public sound files, such as the advent calendar's opening sound.",
  },
  access: {
    read: () => true,
  },
  fields: [],
  upload: {
    mimeTypes: ["audio/mpeg"],
    focalPoint: false,
    crop: false,
  },
};
