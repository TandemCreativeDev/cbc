import { cacheLife, cacheTag } from "next/cache";
import * as payloadSource from "./payload";
import * as sheetSource from "./sheet";

export type { BilingualPage } from "./sheet";

// Production reads the sheet until DATABASE_URL is set there (switchover step 4).
const source = process.env.DATABASE_URL ? payloadSource : sheetSource;

export async function getAboutPage() {
  "use cache";
  cacheLife("minutes");
  cacheTag("about");
  return source.getAboutPage();
}

export async function getTourPage() {
  "use cache";
  cacheLife("minutes");
  cacheTag("tour");
  return source.getTourPage();
}

export async function getTourDates() {
  "use cache";
  cacheLife("minutes");
  cacheTag("tour-dates");
  return source.getTourDates();
}

export async function getMusicItems() {
  "use cache";
  cacheLife("minutes");
  cacheTag("music");
  return source.getMusicItems();
}

export async function getLyrics() {
  "use cache";
  cacheLife("minutes");
  cacheTag("lyrics");
  return source.getLyrics();
}
