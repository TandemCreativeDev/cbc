import type { Field, GlobalConfig } from "payload";
import {
  colorNames,
  defaultColors,
  defaultHour,
  defaultTexts,
  defaultYear,
  textNames,
  type TextName,
} from "../lib/calendar/defaults";
import { optionalColor, requiredColor } from "../lib/calendar/color";
import {
  accentFontOptions,
  bodyFontOptions,
  defaultFonts,
  titleFontOptions,
  toSelectOptions,
} from "../lib/calendar/fontOptions";
import { revalidateGlobal } from "../lib/payload/revalidate";

const colorComponent = { Field: "/components/payload/ColorField#ColorField" };

const colorField = (name: keyof typeof defaultColors): Field => ({
  name,
  type: "text",
  validate: optionalColor,
  admin: { placeholder: defaultColors[name], components: colorComponent },
});

const doorColorField = (name: string, label: string): Field => ({
  name,
  type: "text",
  label,
  required: true,
  validate: requiredColor,
  admin: { components: colorComponent },
});

const textField = (name: TextName): Field => {
  const base = {
    name,
    localized: true,
    admin: {
      placeholder: { en: defaultTexts.en[name], fr: defaultTexts.fr[name] },
      ...(name === "dateRange" || name === "footer"
        ? { description: "{year} is replaced by the year below." }
        : {}),
    },
  };
  return name === "intro" || name === "holding"
    ? { ...base, type: "textarea" }
    : { ...base, type: "text" };
};

const fontField = (
  name: string,
  options: Parameters<typeof toSelectOptions>[0],
  defaultValue: string,
  description: string
): Field => ({
  name,
  type: "select",
  options: toSelectOptions(options),
  defaultValue,
  required: true,
  admin: { description },
});

export const CalendarSettings: GlobalConfig = {
  slug: "calendar-settings",
  access: {
    read: () => true,
  },
  hooks: { afterChange: revalidateGlobal("calendar-settings") },
  fields: [
    {
      name: "behaviour",
      type: "group",
      fields: [
        {
          name: "visible",
          type: "checkbox",
          defaultValue: true,
          admin: {
            description:
              "Off: visitors get a holding page. Signed-in members still see the preview.",
          },
        },
        {
          name: "year",
          type: "number",
          required: true,
          defaultValue: defaultYear,
          min: 2000,
          max: 2100,
          admin: { step: 1 },
        },
        {
          name: "opensAtHour",
          type: "number",
          required: true,
          defaultValue: defaultHour,
          min: 0,
          max: 23,
          admin: {
            step: 1,
            description: "Hour (0 to 23, Paris time) when each day's door opens.",
          },
        },
        {
          name: "afterEnd",
          type: "select",
          required: true,
          defaultValue: "open",
          options: [
            { label: "Stay up with every door open", value: "open" },
            { label: "Show the holding page", value: "holding" },
          ],
          admin: { description: "What visitors get after 24 December." },
        },
      ],
    },
    {
      name: "texts",
      type: "group",
      admin: {
        description:
          "Leave a field empty to use the default shown in grey. Write both languages.",
      },
      fields: textNames.map(textField),
    },
    {
      name: "colors",
      type: "group",
      fields: colorNames.map(colorField),
    },
    {
      name: "doorColors",
      type: "array",
      admin: {
        description:
          "Door colours repeat in this order across the grid. Leave empty for the defaults.",
      },
      fields: [
        doorColorField("door", "Door"),
        doorColorField("ink", "Text on the door"),
        doorColorField("locked", "Door before its day"),
      ],
    },
    {
      name: "fonts",
      type: "group",
      fields: [
        fontField(
          "title",
          titleFontOptions,
          defaultFonts.title,
          "Title, door numbers and song titles."
        ),
        fontField(
          "accent",
          accentFontOptions,
          defaultFonts.accent,
          "The second title line. Only fonts with a true italic, or a script, are offered."
        ),
        fontField("body", bodyFontOptions, defaultFonts.body, "All other text."),
      ],
    },
    {
      name: "images",
      type: "group",
      fields: [
        {
          name: "background",
          type: "upload",
          relationTo: "media",
          admin: { description: "Optional page background." },
        },
        {
          name: "share",
          type: "upload",
          relationTo: "media",
          admin: { description: "Optional picture shown when the link is shared." },
        },
      ],
    },
  ],
};
