export const calendarDays = 24;

export const defaultYear = 2026;

export const defaultColors = {
  paper: "#fff2d7",
  ink: "#351c16",
  orange: "#a23c20",
  quiet: "#694139",
  border: "#79412e55",
} as const;

export type ColorName = keyof typeof defaultColors;

export const colorNames = Object.keys(defaultColors) as ColorName[];

export interface DoorColors {
  door: string;
  ink: string;
  locked: string;
}

export const locales = ["fr", "en"] as const;

export type CalendarLocale = (typeof locales)[number];

export const textNames = [
  "title",
  "accentLine",
  "intro",
  "dateRange",
  "footer",
  "soundOn",
  "soundOff",
  "download",
  "holding",
] as const;

export type TextName = (typeof textNames)[number];

export const defaultTexts: Record<CalendarLocale, Record<TextName, string>> = {
  fr: {
    title: "Calendrier",
    accentLine: "de Clark's",
    intro:
      "Un morceau inédit par jour, parfois super, parfois marrant, parfois très nul. C'est la surprise, bébé.",
    dateRange: "1–24 décembre {year}",
    footer: "Clark’s Bowling Club · Décembre {year}",
    soundOn: "Son des cases activé",
    soundOff: "Son des cases désactivé",
    download: "↓ Télécharger",
    holding: "Le calendrier de l’Avent revient bientôt.",
  },
  en: {
    title: "Advent calendar",
    accentLine: "by Clark's",
    intro:
      "One unreleased track a day, sometimes great, sometimes funny, sometimes really bad. That's the surprise, baby.",
    dateRange: "1–24 December {year}",
    footer: "Clark’s Bowling Club · December {year}",
    soundOn: "Door sound on",
    soundOff: "Door sound off",
    download: "↓ Download",
    holding: "The advent calendar will be back soon.",
  },
};

export const defaultHour = 0;
