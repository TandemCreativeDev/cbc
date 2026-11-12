import { getPayload, type Where } from "payload";
import config from "../../payload.config";
import { locales, type CalendarLocale } from "./defaults";
import { getCalendarDay } from "./schedule";
import { getCalendarSettings } from "./settings";

export interface DoorEntry {
  day: number;
  title: string;
  note: string;
  audio: string;
  color?: string;
  image?: string;
}

export const parseLocale = (value: string | null): CalendarLocale =>
  value === "en" ? "en" : "fr";

export async function findDoors(
  where: Where,
  locale: CalendarLocale
): Promise<DoorEntry[]> {
  const payload = await getPayload({ config });
  const [primary, other] = await Promise.all(
    [locale, ...locales.filter((l) => l !== locale)].map((l) =>
      payload.find({
        collection: "calendar-doors",
        where,
        sort: "day",
        locale: l,
        fallbackLocale: false,
        depth: 1,
        limit: 0,
        pagination: false,
        overrideAccess: true,
      })
    )
  );
  return primary.docs.map((door, index) => {
    const fallback = other.docs[index];
    const image =
      typeof door.image === "object" && door.image?.url ? door.image.url : undefined;
    return {
      day: door.day,
      title: door.title || fallback?.title || "",
      note: door.note || fallback?.note || "",
      audio: `/api/calendar/audio/${door.day}?v=${new Date(door.updatedAt).getTime()}`,
      ...(door.color ? { color: door.color } : {}),
      ...(image ? { image } : {}),
    };
  });
}

/** The settings and the open doors as a visitor, who sees nothing when the calendar is hidden. */
export async function getPublicState(now = new Date()) {
  const settings = await getCalendarSettings();
  const { today, ended } = getCalendarDay(now, settings);
  const open =
    settings.visible && !(ended && settings.afterEnd === "holding");
  return { settings, today, open };
}
