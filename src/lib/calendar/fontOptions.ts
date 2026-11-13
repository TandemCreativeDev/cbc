export interface FontOption {
  label: string;
  italic: boolean;
}

export const titleFontOptions = {
  georgia: { label: "Georgia (default)", italic: true },
  fraunces: { label: "Fraunces", italic: true },
  "goudy-heavyface": { label: "Goudy Heavyface", italic: false },
  caprasimo: { label: "Caprasimo", italic: false },
  "abril-fatface": { label: "Abril Fatface", italic: false },
  "dm-serif-display": { label: "DM Serif Display", italic: true },
  "playfair-display": { label: "Playfair Display", italic: true },
  shrikhand: { label: "Shrikhand", italic: false },
  "alfa-slab-one": { label: "Alfa Slab One", italic: false },
  righteous: { label: "Righteous", italic: false },
  monoton: { label: "Monoton", italic: false },
  "blanch-caps": { label: "Blanch Caps", italic: false },
  "bebas-neue": { label: "Bebas Neue", italic: false },
} as const satisfies Record<string, FontOption>;

export const accentFontOptions = {
  georgia: titleFontOptions.georgia,
  fraunces: titleFontOptions.fraunces,
  "dm-serif-display": titleFontOptions["dm-serif-display"],
  "playfair-display": titleFontOptions["playfair-display"],
  damion: { label: "Damion", italic: false },
  yellowtail: { label: "Yellowtail", italic: false },
  lobster: { label: "Lobster", italic: false },
} as const satisfies Record<string, FontOption>;

export const bodyFontOptions = {
  system: { label: "System font (default)", italic: true },
  jost: { label: "Jost", italic: true },
  "dm-sans": { label: "DM Sans", italic: true },
  outfit: { label: "Outfit", italic: false },
  fraunces: titleFontOptions.fraunces,
} as const satisfies Record<string, FontOption>;

export type TitleFont = keyof typeof titleFontOptions;
export type AccentFont = keyof typeof accentFontOptions;
export type BodyFont = keyof typeof bodyFontOptions;

export const defaultFonts = {
  title: "georgia",
  accent: "georgia",
  body: "system",
} as const satisfies {
  title: TitleFont;
  accent: AccentFont;
  body: BodyFont;
};

export const toSelectOptions = (options: Record<string, FontOption>) =>
  Object.entries(options).map(([value, { label }]) => ({ label, value }));
