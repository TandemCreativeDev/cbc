import { cacheLife, cacheTag } from "next/cache";
import { fallbackCarousel } from "./carouselFallback";
import * as payloadSource from "./payload";

export type { BilingualPage, CarouselPhoto } from "./payload";

export async function getAboutPage() {
  "use cache";
  cacheLife("minutes");
  cacheTag("about");
  const carousel = await payloadSource.getCarousel();
  return {
    ...(await payloadSource.getAboutPage()),
    carousel: carousel.length ? carousel : fallbackCarousel,
  };
}

export async function getTourPage() {
  "use cache";
  cacheLife("minutes");
  cacheTag("tour");
  return payloadSource.getTourPage();
}

export async function getTourDates() {
  "use cache";
  cacheLife("minutes");
  cacheTag("tour-dates");
  return payloadSource.getTourDates();
}

export async function getMusicItems() {
  "use cache";
  cacheLife("minutes");
  cacheTag("music");
  return payloadSource.getMusicItems();
}

export async function getLyrics() {
  "use cache";
  cacheLife("minutes");
  cacheTag("lyrics");
  return payloadSource.getLyrics();
}
