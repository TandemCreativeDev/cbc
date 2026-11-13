import { cacheLife, cacheTag } from "next/cache";
import { getPayload } from "payload";
import config from "../../payload.config";
import type { Media } from "../../payload-types";
import { isHexColor } from "./color";
import {
  colorNames,
  defaultColors,
  defaultHour,
  defaultTexts,
  defaultYear,
  locales,
  textNames,
  type CalendarLocale,
  type ColorName,
  type DoorColors,
  type TextName,
} from "./defaults";
import { defaultFonts } from "./fontOptions";

export interface CalendarSettings {
  visible: boolean;
  year: number;
  opensAtHour: number;
  afterEnd: "open" | "holding";
  texts: Record<CalendarLocale, Record<TextName, string>>;
  colors: Record<ColorName, string>;
  doorColors: DoorColors[] | null;
  fonts: { title: string; accent: string; body: string };
  backgroundUrl: string | null;
  shareUrl: string | null;
}

const mediaUrl = (media: number | Media | null | undefined) =>
  typeof media === "object" && media?.url ? media.url : null;

/** Admin changes expire the `calendar-settings` tag; the lifetime is the fallback and stays under a minute. */
export async function getCalendarSettings(): Promise<CalendarSettings> {
  "use cache";
  cacheTag("calendar-settings");
  cacheLife({ stale: 0, revalidate: 20, expire: 50 });

  const payload = await getPayload({ config });
  const [fr, en] = await Promise.all(
    locales.map((locale) =>
      payload.findGlobal({
        slug: "calendar-settings",
        locale,
        fallbackLocale: false,
        depth: 1,
      })
    )
  );
  const stored = { fr, en };

  const texts = Object.fromEntries(
    locales.map((locale) => [
      locale,
      Object.fromEntries(
        textNames.map((name) => [
          name,
          stored[locale].texts?.[name]?.trim() || defaultTexts[locale][name],
        ])
      ),
    ])
  ) as CalendarSettings["texts"];

  const colors = Object.fromEntries(
    colorNames.map((name) => {
      const value = en.colors?.[name];
      return [name, isHexColor(value) ? value : defaultColors[name]];
    })
  ) as CalendarSettings["colors"];

  const storedRows = (en.doorColors ?? []).filter(
    ({ door, ink, locked }) =>
      isHexColor(door) && isHexColor(ink) && isHexColor(locked)
  );

  return {
    visible: en.behaviour?.visible ?? false,
    year: en.behaviour?.year ?? defaultYear,
    opensAtHour: en.behaviour?.opensAtHour ?? defaultHour,
    afterEnd: en.behaviour?.afterEnd ?? "open",
    texts,
    colors,
    doorColors: storedRows.length
      ? storedRows.map(({ door, ink, locked }) => ({ door, ink, locked }))
      : null,
    fonts: {
      title: en.fonts?.title ?? defaultFonts.title,
      accent: en.fonts?.accent ?? defaultFonts.accent,
      body: en.fonts?.body ?? defaultFonts.body,
    },
    backgroundUrl: mediaUrl(en.images?.background),
    shareUrl: mediaUrl(en.images?.share),
  };
}
