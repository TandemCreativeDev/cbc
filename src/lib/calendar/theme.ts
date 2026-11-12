import type { ColorName, DoorColors } from "./defaults";

type Colors = Record<ColorName, string>;
type Base = "paper" | "ink" | "orange";

interface Shift {
  base: Base;
  lightness: number;
  chroma: number;
  hue: number;
}

/** Every shade the page uses besides the five named colours, as an OKLCH shift of one of them. */
const shades = {
  sand: { base: "paper", lightness: -0.0535, chroma: 1.223, hue: -9.72 },
  glow: { base: "orange", lightness: 0.3185, chroma: 0.7216, hue: 30.54 },
  sunrise: { base: "orange", lightness: 0.3837, chroma: 0.7516, hue: 40.66 },
  sunset: { base: "orange", lightness: 0.2552, chroma: 0.8742, hue: 23.83 },
  gold: { base: "orange", lightness: 0.3086, chroma: 0.9123, hue: 37.11 },
  ring: { base: "orange", lightness: 0.0229, chroma: 0.9577, hue: 1.57 },
  rimA: { base: "orange", lightness: 0.0758, chroma: 0.9669, hue: 2.77 },
  rimB: { base: "orange", lightness: 0.2741, chroma: 0.8369, hue: 30.07 },
  vinylCore: { base: "ink", lightness: 0.0067, chroma: 0.9448, hue: -1.84 },
  grooveA: { base: "ink", lightness: 0.0272, chroma: 1.1796, hue: 1.47 },
  grooveB: { base: "ink", lightness: 0.1019, chroma: 1.5096, hue: 4.41 },
  shade: { base: "ink", lightness: -0.0432, chroma: 0.8793, hue: -0.04 },
  cardShadow: { base: "ink", lightness: 0.1409, chroma: 1.9478, hue: 1.22 },
  door1: { base: "orange", lightness: 0.0165, chroma: 0.9612, hue: 1.89 },
  door2: { base: "orange", lightness: 0.2896, chroma: 0.9112, hue: 35.44 },
  door3: { base: "orange", lightness: -0.0712, chroma: 0.6085, hue: -6.03 },
  door4: { base: "ink", lightness: 0.0987, chroma: 1.4574, hue: 6.53 },
  doorInk1: { base: "paper", lightness: 0.0022, chroma: 0.9892, hue: 1.54 },
  doorInk2: { base: "ink", lightness: -0.0312, chroma: 0.8915, hue: 4.84 },
  locked1: { base: "orange", lightness: 0.3369, chroma: 0.6085, hue: 29.64 },
  locked2: { base: "orange", lightness: 0.3641, chroma: 0.6258, hue: 41.94 },
  locked3: { base: "orange", lightness: 0.2925, chroma: 0.5949, hue: 8.99 },
  locked4: { base: "orange", lightness: 0.3032, chroma: 0.4315, hue: 21.69 },
} as const satisfies Record<string, Shift>;

const toLinear = (value: number) =>
  value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
const toGamma = (value: number) =>
  value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055;

const rgbDigits = (hex: string) =>
  hex.length <= 5
    ? [...hex.slice(1, 4)].map((digit) => digit + digit).join("")
    : hex.slice(1, 7);

const withAlpha = (hex: string, alpha: string) => `#${rgbDigits(hex)}${alpha}`;

function toOklch(hex: string): [number, number, number] {
  const number = parseInt(rgbDigits(hex), 16);
  const [r, g, b] = [number >> 16, (number >> 8) & 255, number & 255].map(
    (channel) => toLinear(channel / 255)
  );
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const b2 = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [lightness, Math.hypot(a, b2), (Math.atan2(b2, a) * 180) / Math.PI];
}

function toHex([lightness, chroma, hue]: [number, number, number]): string {
  const a = chroma * Math.cos((hue * Math.PI) / 180);
  const b = chroma * Math.sin((hue * Math.PI) / 180);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return `#${rgb
    .map((channel) =>
      Math.round(Math.min(1, Math.max(0, toGamma(channel))) * 255)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}

function shade(colors: Colors, { base, lightness, chroma, hue }: Shift) {
  const [l, c, h] = toOklch(colors[base]);
  return toHex([l + lightness, c * chroma, h + hue]);
}

export function deriveShades(colors: Colors) {
  return Object.fromEntries(
    Object.entries(shades).map(([name, shift]) => [name, shade(colors, shift)])
  ) as Record<keyof typeof shades, string>;
}

/** The door colours used until the admin sets its own: shades of the five named colours. */
export function defaultDoorRows(colors: Colors): DoorColors[] {
  const d = deriveShades(colors);
  return [
    { door: d.door1, ink: d.doorInk1, locked: d.locked1 },
    { door: d.door2, ink: d.doorInk2, locked: d.locked2 },
    { door: d.door3, ink: d.doorInk1, locked: d.locked3 },
    { door: d.door4, ink: d.doorInk1, locked: d.locked4 },
  ];
}

export const sandColor = (colors: Colors) => shade(colors, shades.sand);

const kebab = (name: string) =>
  name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export function themeVariables(colors: Colors): string {
  const derived = deriveShades(colors);
  const declarations = {
    "--paper": colors.paper,
    "--ink": colors.ink,
    "--orange": colors.orange,
    "--quiet": colors.quiet,
    "--border": colors.border,
    ...Object.fromEntries(
      Object.entries(derived).map(([name, value]) => [`--${kebab(name)}`, value])
    ),
    "--glow-soft": `${derived.glow}80`,
    "--card-shadow-soft": `${derived.cardShadow}2e`,
    "--shade-soft": `${derived.shade}22`,
    "--shade-rule": `${derived.shade}55`,
    "--ink-hover": withAlpha(colors.ink, "14"),
  };
  return Object.entries(declarations)
    .map(([name, value]) => `${name}:${value}`)
    .join(";");
}

export function doorRowsCss(rows: DoorColors[]): string {
  const count = rows.length;
  return rows
    .map(
      ({ door, ink, locked }, index) =>
        `.day:nth-child(${count}n+${index + 1}){--door-color:${door};--door-ink:${ink};--locked-color:${locked}}`
    )
    .join("\n");
}
