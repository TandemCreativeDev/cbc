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
  "holding",
] as const;

export type TextName = (typeof textNames)[number];

export const defaultTexts: Record<CalendarLocale, Record<TextName, string>> = {
  fr: {
    title: "Calendrier",
    accentLine: "de Clark's",
    intro:
      "Une maquette de morceau inédite, tous les jours jusqu'au 24 décembre. Joyeux Noël !",
    dateRange: "1–24 décembre {year}",
    footer: "Clark’s Bowling Club · Décembre {year}",
    soundOn: "Son des cases activé",
    soundOff: "Son des cases désactivé",
    holding: "Le calendrier de l’Avent revient bientôt.",
  },
  en: {
    title: "Advent calendar",
    accentLine: "by Clark's",
    intro:
      "An unreleased song demo every day until 24 December. Merry Christmas!",
    dateRange: "1–24 December {year}",
    footer: "Clark’s Bowling Club · December {year}",
    soundOn: "Door sound on",
    soundOff: "Door sound off",
    holding: "The advent calendar will be back soon.",
  },
};

export const defaultHour = 0;
