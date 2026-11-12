import type { CollectionConfig } from "payload";
import { revalidateCollection } from "../lib/payload/revalidate";
import { optionalHttpsUrl } from "../lib/payload/validators";

export const TourDates: CollectionConfig = {
  slug: "tour-dates",
  admin: {
    useAsTitle: "venue",
    defaultColumns: ["eventDate", "venue", "location"],
  },
  access: {
    read: () => true,
  },
  orderable: true,
  hooks: revalidateCollection("tour-dates"),
  fields: [
    {
      name: "eventDate",
      type: "date",
      required: true,
      index: true,
      admin: { date: { pickerAppearance: "dayOnly" } },
    },
    { name: "venue", type: "text", required: true },
    { name: "location", type: "text", required: true },
    { name: "locationUrl", type: "text", validate: optionalHttpsUrl },
    { name: "ticketUrl", type: "text", validate: optionalHttpsUrl },
  ],
};
