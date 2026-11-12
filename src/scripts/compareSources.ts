import { isDeepStrictEqual } from "node:util";
import * as payloadSource from "../lib/data/payload";
import * as sheetSource from "../lib/data/sheet";
import type { TourDateType } from "../utils/types";

const normalise = {
  tourDates: (dates: TourDateType[]) =>
    dates
      .map((date) => {
        const [day, month, year] = date.eventDate.split("/").map(Number);
        return {
          eventDate: `${year}-${month}-${day}`,
          location: date.location.trim(),
          venue: date.venue,
          locationUrl: date.locationUrl || "",
          ticketUrl: date.ticketUrl || "",
        };
      })
      .sort((a, b) =>
        `${a.eventDate}${a.venue}`.localeCompare(`${b.eventDate}${b.venue}`)
      ),
  withEmpty: <T extends object>(items: T[]) =>
    items.map((item) =>
      Object.fromEntries(
        Object.entries(item).map(([key, value]) => [key, value ?? ""])
      )
    ),
};

const comparisons = [
  ["about page", () => sheetSource.getAboutPage(), () => payloadSource.getAboutPage()],
  ["tour page", () => sheetSource.getTourPage(), () => payloadSource.getTourPage()],
  [
    "tour dates",
    async () => normalise.tourDates(await sheetSource.getTourDates()),
    async () => normalise.tourDates(await payloadSource.getTourDates()),
  ],
  [
    "music items",
    async () => normalise.withEmpty(await sheetSource.getMusicItems()),
    async () => normalise.withEmpty(await payloadSource.getMusicItems()),
  ],
  [
    "lyrics",
    async () => normalise.withEmpty(await sheetSource.getLyrics()),
    async () => normalise.withEmpty(await payloadSource.getLyrics()),
  ],
] as const;

let differences = 0;
for (const [name, fromSheet, fromPayload] of comparisons) {
  const [sheet, payload] = await Promise.all([fromSheet(), fromPayload()]);
  if (isDeepStrictEqual(sheet, payload)) {
    const count = Array.isArray(sheet) ? ` (${sheet.length})` : "";
    console.log(`SAME  ${name}${count}`);
    continue;
  }
  differences++;
  console.log(`DIFF  ${name}`);
  console.log("  sheet:  ", JSON.stringify(sheet).slice(0, 600));
  console.log("  payload:", JSON.stringify(payload).slice(0, 600));
}

console.log(differences === 0 ? "No difference." : `${differences} differ.`);
process.exit(differences === 0 ? 0 : 1);
