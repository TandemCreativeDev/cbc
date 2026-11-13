import {
  Abril_Fatface,
  Alfa_Slab_One,
  Bebas_Neue,
  Caprasimo,
  Damion,
  DM_Sans,
  DM_Serif_Display,
  Fraunces,
  Jost,
  Lobster,
  Monoton,
  Outfit,
  Playfair_Display,
  Righteous,
  Shrikhand,
  Yellowtail,
} from "next/font/google";
import localFont from "next/font/local";
import type { AccentFont, BodyFont, TitleFont } from "./fontOptions";

/**
 * No preload and no class applied anywhere: a font file is only requested once
 * its family name is used in the page's CSS, which only happens for the three
 * fonts selected in the admin. The options are literals because next/font
 * reads them at build time.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  style: ["normal", "italic"],
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: "400",
  style: ["normal", "italic"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  style: ["normal", "italic"],
});

const caprasimo = Caprasimo({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: "400",
});

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: "400",
});

const shrikhand = Shrikhand({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: "400",
});

const alfaSlabOne = Alfa_Slab_One({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: "400",
});

const righteous = Righteous({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: "400",
});

const monoton = Monoton({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: "400",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: "400",
});

const damion = Damion({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: "400",
});

const yellowtail = Yellowtail({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: "400",
});

const lobster = Lobster({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  weight: "400",
});

const jost = Jost({ subsets: ["latin"], display: "swap", preload: false });

const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", preload: false });

const outfit = Outfit({ subsets: ["latin"], display: "swap", preload: false });

const blanchCaps = localFont({
  src: "../../fonts/Blanch-Caps.woff2",
  display: "swap",
  preload: false,
});

const goudyHeavyface = localFont({
  src: "../../fonts/GoudyStd-Heavyface.woff2",
  display: "swap",
  preload: false,
});

const loaded = {
  "fraunces": fraunces,
  "dm-serif-display": dmSerifDisplay,
  "playfair-display": playfairDisplay,
  "caprasimo": caprasimo,
  "abril-fatface": abrilFatface,
  "shrikhand": shrikhand,
  "alfa-slab-one": alfaSlabOne,
  "righteous": righteous,
  "monoton": monoton,
  "bebas-neue": bebasNeue,
  "damion": damion,
  "yellowtail": yellowtail,
  "lobster": lobster,
  "jost": jost,
  "dm-sans": dmSans,
  "outfit": outfit,
  "blanch-caps": blanchCaps,
  "goudy-heavyface": goudyHeavyface,
};

type Loaded = keyof typeof loaded;

const stack = (id: Loaded, generic: string) =>
  `${loaded[id].style.fontFamily},${generic}`;

export const titleFamilies: Record<TitleFont, string> = {
  georgia: "Georgia,serif",
  fraunces: stack("fraunces", "serif"),
  "goudy-heavyface": stack("goudy-heavyface", "serif"),
  caprasimo: stack("caprasimo", "serif"),
  "abril-fatface": stack("abril-fatface", "serif"),
  "dm-serif-display": stack("dm-serif-display", "serif"),
  "playfair-display": stack("playfair-display", "serif"),
  shrikhand: stack("shrikhand", "serif"),
  "alfa-slab-one": stack("alfa-slab-one", "serif"),
  righteous: stack("righteous", "sans-serif"),
  monoton: stack("monoton", "sans-serif"),
  // Blanch Caps has no œ or ’; Bebas Neue is only fetched if one of them is shown.
  "blanch-caps": `${loaded["blanch-caps"].style.fontFamily},${stack("bebas-neue", "sans-serif")}`,
  "bebas-neue": stack("bebas-neue", "sans-serif"),
};

export const accentFamilies: Record<AccentFont, string> = {
  georgia: "Georgia,serif",
  fraunces: titleFamilies.fraunces,
  "dm-serif-display": titleFamilies["dm-serif-display"],
  "playfair-display": titleFamilies["playfair-display"],
  damion: stack("damion", "cursive"),
  yellowtail: stack("yellowtail", "cursive"),
  lobster: stack("lobster", "cursive"),
};

export const bodyFamilies: Record<BodyFont, string> = {
  system: "system-ui,sans-serif",
  jost: stack("jost", "sans-serif"),
  "dm-sans": stack("dm-sans", "sans-serif"),
  outfit: stack("outfit", "sans-serif"),
  fraunces: titleFamilies.fraunces,
};
