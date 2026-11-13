"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { defaultYear } from "@/lib/calendar/defaults";
import { getCalendarDay } from "@/lib/calendar/schedule";

const subscribe = () => () => {};

const isCalendarSeason = () => {
  const { today, ended } = getCalendarDay(new Date(), {
    year: defaultYear,
    opensAtHour: 0,
  });
  return today > 0 && !ended;
};

/** Shown from 1 to 24 December, Paris time. Checked in the browser so the home page stays static. */
export default function CalendarButton() {
  const { isFrench } = useLanguage();
  const inSeason = useSyncExternalStore(subscribe, isCalendarSeason, () => false);

  if (!inSeason) return null;

  return (
    <Link
      href="/calendrier"
      className="absolute bottom-32 left-1/2 z-20 -translate-x-1/2 rounded-full bg-clarks-orange px-6 py-3 text-center font-bold text-black whitespace-nowrap hover:bg-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      {isFrench ? "Le calendrier de l’Avent" : "The advent calendar"}
    </Link>
  );
}
