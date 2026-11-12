import { getPayload } from "payload";
import config from "../../payload.config";
import type { IFrameProps, LyricsProps, TourDateType } from "../../utils/types";
import type { BilingualPage } from "./sheet";

const locales = ["en", "fr"] as const;
const read = { depth: 0, fallbackLocale: "en", limit: 0, pagination: false } as const;

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`;
}

async function getPageCopy(
  slug: "about-page" | "tour-page"
): Promise<BilingualPage> {
  const payload = await getPayload({ config });
  const [english, french] = await Promise.all(
    locales.map((locale) =>
      payload.findGlobal({ slug, locale, depth: 0, fallbackLocale: "en" })
    )
  );
  const copy = ({ title, content }: typeof english) => ({ title, content });
  return { french: copy(french), english: copy(english) };
}

export const getAboutPage = () => getPageCopy("about-page");

export const getTourPage = () => getPageCopy("tour-page");

export async function getTourDates(): Promise<TourDateType[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "tour-dates",
    sort: "_order",
    ...read,
  });
  return docs.map((doc) => ({
    eventDate: formatDate(doc.eventDate),
    location: doc.location,
    venue: doc.venue,
    locationUrl: doc.locationUrl ?? "",
    ticketUrl: doc.ticketUrl ?? "",
  }));
}

export async function getMusicItems(): Promise<IFrameProps[]> {
  const payload = await getPayload({ config });
  const [english, french] = await Promise.all(
    locales.map((locale) =>
      payload.find({
        collection: "music-items",
        sort: "_order",
        locale,
        ...read,
      })
    )
  );
  return english.docs.map((doc, index) => ({
    title: doc.title,
    src: doc.src,
    href: doc.href ?? "",
    type: doc.type,
    categorie: french.docs[index].category,
    category: doc.category,
  }));
}

export async function getLyrics(): Promise<LyricsProps[]> {
  const payload = await getPayload({ config });
  const [english, french] = await Promise.all(
    locales.map((locale) =>
      payload.find({
        collection: "lyrics",
        sort: "_order",
        where: { status: { equals: "published" } },
        locale,
        ...read,
      })
    )
  );
  return english.docs.map((doc, index) => ({
    title: doc.title,
    album: doc.album,
    date: doc.date ?? "",
    lyrics: doc.lyrics ?? "",
    paroles: french.docs[index].lyrics ?? "",
  }));
}
