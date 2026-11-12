import type { CollectionConfig } from "payload";
import { revalidateCollection } from "../lib/payload/revalidate";
import { embedSrc, optionalHttpsUrl } from "../lib/payload/validators";

export const MusicItems: CollectionConfig = {
  slug: "music-items",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "type", "category"],
  },
  access: {
    read: () => true,
  },
  orderable: true,
  hooks: revalidateCollection("music"),
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "type",
      type: "select",
      required: true,
      options: ["youtube", "spotify", "bandcamp"],
    },
    { name: "src", type: "text", required: true, validate: embedSrc },
    { name: "href", type: "text", validate: optionalHttpsUrl },
    { name: "category", type: "text", required: true, localized: true },
  ],
};
