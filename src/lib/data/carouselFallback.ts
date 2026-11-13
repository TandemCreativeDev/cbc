import type { CarouselPhoto } from "./sheet";

/** Shown until the About page has photos in Payload; delete with public/images/carousel/. */
export const fallbackCarousel: CarouselPhoto[] = [
  ["argentic", "Band portrait inside an abandoned warehouse"],
  ["posing", "Band posing together in dilapidated building"],
  ["leaving", "Band leaving the warehouse after rehearsal and shoot"],
  ["yesday", "Still of the band in Yes Day music video shoot"],
].map(([name, alt]) => ({
  src: `/images/carousel/${name}.jpg`,
  alt: { english: alt, french: alt },
}));
