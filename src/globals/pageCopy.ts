import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../lib/payload/revalidate";

const pageCopy = (slug: string, tag: string): GlobalConfig => ({
  slug,
  access: {
    read: () => true,
  },
  hooks: { afterChange: revalidateGlobal(tag) },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    { name: "content", type: "textarea", required: true, localized: true },
  ],
});

export const AboutPage = pageCopy("about-page", "about");
export const TourPage = pageCopy("tour-page", "tour");
