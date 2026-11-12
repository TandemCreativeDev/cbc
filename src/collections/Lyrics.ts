import type { CollectionConfig } from "payload";
import { revalidateCollection } from "../lib/payload/revalidate";

export const Lyrics: CollectionConfig = {
  slug: "lyrics",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "album", "status"],
  },
  access: {
    read: ({ req }) =>
      req.user ? true : { status: { equals: "published" } },
  },
  orderable: true,
  hooks: revalidateCollection("lyrics"),
  fields: [
    { name: "title", type: "text", required: true },
    { name: "album", type: "text", required: true },
    { name: "date", type: "text" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: ["draft", "published"],
    },
    {
      name: "lyrics",
      type: "textarea",
      localized: true,
      validate: (value, { siblingData }) =>
        (siblingData as { status?: string }).status === "published" && !value
          ? "Required to publish"
          : true,
    },
  ],
};
