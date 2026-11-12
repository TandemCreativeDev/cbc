import { calendarDays } from "./defaults";
import type { CalendarSettings } from "./settings";

type Schedule = Pick<CalendarSettings, "year" | "opensAtHour">;

const parisParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  hourCycle: "h23",
});

export interface CalendarDay {
  /** Doors 1 to `today` are open: 0 before the first door, 24 once the last is open. */
  today: number;
  /** True from the day after the 24th. */
  ended: boolean;
}

/** Which doors are open at `now`, judged in Paris time and shifted by the opening hour. */
export function getCalendarDay(now: Date, { year, opensAtHour }: Schedule): CalendarDay {
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parisParts.formatToParts(now).find((p) => p.type === type)?.value);
  const shifted = new Date(
    Date.UTC(part("year"), part("month") - 1, part("day"), part("hour")) -
      opensAtHour * 3_600_000
  );
  const [y, m, d] = [
    shifted.getUTCFullYear(),
    shifted.getUTCMonth() + 1,
    shifted.getUTCDate(),
  ];
  if (y < year || (y === year && m < 12)) return { today: 0, ended: false };
  if (y === year && d <= calendarDays) return { today: d, ended: false };
  return { today: calendarDays, ended: true };
}
