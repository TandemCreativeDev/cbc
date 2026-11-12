import type { CollectionConfig } from "payload";
import { calendarDays } from "../lib/calendar/defaults";
import { optionalColor } from "../lib/calendar/color";

export const CalendarDoors: CollectionConfig = {
  slug: "calendar-doors",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["day", "title", "filename"],
    description:
      "One door of the advent calendar. The MP3 is private: visitors only hear it on or after its day.",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
  },
  defaultSort: "day",
  fields: [
    {
      name: "day",
      type: "number",
      required: true,
      unique: true,
      min: 1,
      max: calendarDays,
      admin: { step: 1 },
    },
    { name: "title", type: "text", required: true, localized: true },
    { name: "note", type: "textarea", localized: true },
    {
      name: "color",
      type: "text",
      validate: optionalColor,
      admin: {
        description: "Optional. Replaces this door's colour, for example #a54425.",
        components: { Field: "/components/payload/ColorField#ColorField" },
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional picture shown behind the opened door." },
    },
  ],
  upload: {
    mimeTypes: ["audio/mpeg"],
    focalPoint: false,
    crop: false,
  },
};
