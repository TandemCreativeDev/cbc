import { getPayload } from "payload";
import path from "path";
import Papa from "papaparse";
import config from "../payload.config";
import { fallbackCarousel } from "../lib/data/carouselFallback";
import fetchSheet from "../utils/fetchSheet";
import parsePageCsv from "../utils/parsePageCsv";
import type { IFrameProps, LyricsProps, TourDateType } from "../utils/types";

const context = { skipRevalidate: true };
const payload = await getPayload({ config });

const parseRows = <T extends object>(csv: string): T[] =>
  Papa.parse<T>(csv, { header: true, skipEmptyLines: true }).data;

function toIsoDate(eventDate: string): string {
  const [day, month, year] = eventDate.split("/").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12)).toISOString();
}

const tally = (counts: Record<string, number>, id?: number) => {
  const key = id ? "updated" : "created";
  counts[key] = (counts[key] ?? 0) + 1;
};

async function importPages() {
  const tabs = [
    { slug: "about-page", gid: 0 },
    { slug: "tour-page", gid: 127405583 },
  ] as const;
  for (const { slug, gid } of tabs) {
    const [french, english] = parsePageCsv(await fetchSheet(gid));
    for (const [locale, page] of [
      ["en", english],
      ["fr", french],
    ] as const) {
      await payload.updateGlobal({ slug, data: page, locale, context });
    }
    console.log(`${slug}: updated`);
  }
}

async function importCarousel() {
  const about = await payload.findGlobal({ slug: "about-page", depth: 0 });
  if (about.carousel?.length) {
    console.log(`carousel: ${about.carousel.length} photos already there, skipped`);
    return;
  }
  const photos: number[] = [];
  for (const { src, alt } of fallbackCarousel) {
    const filename = path.basename(src);
    const { docs } = await payload.find({
      collection: "media",
      where: { filename: { equals: filename } },
      limit: 1,
      depth: 0,
    });
    const id =
      docs[0]?.id ??
      (
        await payload.create({
          collection: "media",
          data: { alt: alt.english },
          filePath: path.resolve("public", src.slice(1)),
          context: { ...context },
        })
      ).id;
    photos.push(id);
  }
  for (const [locale, key] of [
    ["en", "english"],
    ["fr", "french"],
  ] as const) {
    const current = await payload.findGlobal({ slug: "about-page", depth: 0 });
    await payload.updateGlobal({
      slug: "about-page",
      locale,
      data: {
        carousel: photos.map((photo, index) => ({
          id: current.carousel?.[index]?.id,
          photo,
          alt: fallbackCarousel[index].alt[key],
        })),
      },
      context,
    });
  }
  console.log("carousel:", photos.length, "photos imported");
}

async function importTourDates() {
  const rows = parseRows<TourDateType>(await fetchSheet(572869052)).filter(
    (row) => !!row.eventDate
  );
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const data = {
      eventDate: toIsoDate(row.eventDate),
      venue: row.venue.trim(),
      location: row.location.trim(),
      locationUrl: row.locationUrl?.trim() || null,
      ticketUrl: row.ticketUrl?.trim() || null,
    };
    const { docs } = await payload.find({
      collection: "tour-dates",
      where: {
        eventDate: { equals: data.eventDate },
        venue: { equals: data.venue },
      },
      limit: 1,
      depth: 0,
    });
    if (docs[0]) {
      await payload.update({
        collection: "tour-dates",
        id: docs[0].id,
        data,
        context,
      });
    } else {
      await payload.create({ collection: "tour-dates", data, context });
    }
    tally(counts, docs[0]?.id);
  }
  console.log("tour-dates:", counts);
}

async function importMusicItems() {
  const rows = parseRows<IFrameProps>(await fetchSheet(1713768433)).filter(
    (row) => !!row.title && !!row.type
  );
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const src = row.src.trim();
    const data = {
      title: row.title.trim(),
      type: row.type as "youtube" | "spotify" | "bandcamp",
      src,
      href: row.href?.trim() || null,
    };
    const { docs } = await payload.find({
      collection: "music-items",
      where: { src: { equals: src } },
      limit: 1,
      depth: 0,
    });
    let id = docs[0]?.id;
    if (id) {
      await payload.update({
        collection: "music-items",
        id,
        data: { ...data, category: row.category?.trim() },
        locale: "en",
        context,
      });
    } else {
      id = (
        await payload.create({
          collection: "music-items",
          data: { ...data, category: row.category?.trim() ?? "" },
          locale: "en",
          context,
        })
      ).id;
    }
    await payload.update({
      collection: "music-items",
      id,
      data: { category: row.categorie?.trim() },
      locale: "fr",
      context,
    });
    tally(counts, docs[0]?.id);
  }
  console.log("music-items:", counts);
}

async function importLyrics() {
  const rows = parseRows<LyricsProps>(await fetchSheet(145198726)).filter(
    (row) => !!row.title
  );
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const data = {
      title: row.title.trim(),
      album: row.album?.trim() ?? "",
      date: row.date?.trim() || null,
      status: row.lyrics ? ("published" as const) : ("draft" as const),
      lyrics: row.lyrics || null,
    };
    const { docs } = await payload.find({
      collection: "lyrics",
      where: {
        title: { equals: data.title },
        album: { equals: data.album },
      },
      limit: 1,
      depth: 0,
    });
    let id = docs[0]?.id;
    if (id) {
      await payload.update({
        collection: "lyrics",
        id,
        data,
        locale: "en",
        context,
      });
    } else {
      id = (
        await payload.create({
          collection: "lyrics",
          data,
          locale: "en",
          context,
        })
      ).id;
    }
    if (row.paroles) {
      await payload.update({
        collection: "lyrics",
        id,
        data: { lyrics: row.paroles },
        locale: "fr",
        context,
      });
    }
    tally(counts, docs[0]?.id);
  }
  console.log("lyrics:", counts);
}

await importPages();
await importCarousel();
await importTourDates();
await importMusicItems();
await importLyrics();
process.exit(0);
