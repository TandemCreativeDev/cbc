import type { Field, GlobalConfig } from "payload";
import { revalidateGlobal } from "../lib/payload/revalidate";

const pageCopy = (
  slug: string,
  tag: string,
  extraFields: Field[] = []
): GlobalConfig => ({
  slug,
  access: {
    read: () => true,
  },
  hooks: { afterChange: revalidateGlobal(tag) },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    { name: "content", type: "textarea", required: true, localized: true },
    ...extraFields,
  ],
});

export const AboutPage = pageCopy("about-page", "about", [
  {
    name: "carousel",
    type: "array",
    labels: { singular: "Photo", plural: "Photos" },
    admin: { description: "Photos in the About page carousel, in order." },
    fields: [
      { name: "photo", type: "upload", relationTo: "media", required: true },
      { name: "alt", type: "text", required: true, localized: true },
    ],
  },
]);
export const TourPage = pageCopy("tour-page", "tour");
