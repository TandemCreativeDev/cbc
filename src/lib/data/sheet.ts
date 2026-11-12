import fetchSheet from "../../utils/fetchSheet";
import parseCsv from "../../utils/parseCsv";
import parsePageCsv from "../../utils/parsePageCsv";
import {
  IFrameProps,
  LyricsProps,
  Page,
  TourDateType,
} from "../../utils/types";

export interface BilingualPage {
  french: Page;
  english: Page;
}

async function getPage(tabGid: number): Promise<BilingualPage> {
  const [french, english] = parsePageCsv(await fetchSheet(tabGid));
  if (!french || !english) {
    throw new Error(`Sheet tab ${tabGid} is missing a language column`);
  }
  return { french, english };
}

export const getAboutPage = () => getPage(0);

export const getTourPage = () => getPage(127405583);

export async function getTourDates(): Promise<TourDateType[]> {
  return parseCsv<TourDateType>(
    await fetchSheet(572869052),
    (row) => !!row.eventDate
  );
}

export async function getMusicItems(): Promise<IFrameProps[]> {
  return parseCsv<IFrameProps>(
    await fetchSheet(1713768433),
    (row) => !!row.title && !!row.type
  );
}

export async function getLyrics(): Promise<LyricsProps[]> {
  return parseCsv<LyricsProps>(
    await fetchSheet(145198726),
    (row) => !!row.title && !!row.lyrics
  );
}
