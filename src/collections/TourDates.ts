import type { CollectionConfig } from "payload";

export const TourDates: CollectionConfig = {
  slug: "tour-dates",
  admin: {
    useAsTitle: "venue",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "eventDate",
      type: "date",
      required: true,
    },
    {
      name: "venue",
      type: "text",
      required: true,
    },
    {
      name: "location",
      type: "text",
      required: true,
    },
    {
      name: "locationUrl",
      type: "text",
    },
    {
      name: "ticketUrl",
      type: "text",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
  ],
};
