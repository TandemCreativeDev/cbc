"use client";

import { useState, type KeyboardEvent } from "react";
import Toggle from "@/components/ui/Toggle";
import { LanguageContext } from "@/context/LanguageContext";

/** The ball's slide in the site's Toggle (motion-safe:duration-300). */
const slideMs = 300;

/** The site's language toggle, switching between the two calendar addresses once the ball has slid across. */
export function CalendarLanguageToggle({ isFrench, href }: { isFrench: boolean; href: string }) {
  const [shown, setShown] = useState(isFrench);

  const switchLanguage = (value: boolean) => {
    if (value === shown) return;
    setShown(value);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => window.location.assign(href), reduced ? 0 : slideMs);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" || !(event.target instanceof HTMLInputElement)) return;
    event.preventDefault();
    switchLanguage(!shown);
  };

  return (
    <div className="calendar-language" onKeyDown={onKeyDown}>
      <LanguageContext.Provider value={{ isFrench: shown, setIsFrench: switchLanguage, isLoading: false }}>
        <Toggle />
      </LanguageContext.Provider>
    </div>
  );
}
