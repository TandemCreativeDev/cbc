"use client";

import Toggle from "@/components/ui/Toggle";
import { LanguageContext } from "@/context/LanguageContext";

/** The site's language toggle, switching between the two calendar addresses instead of the site's language state. */
export function CalendarLanguageToggle({ isFrench, href }: { isFrench: boolean; href: string }) {
  return (
    <LanguageContext.Provider
      value={{ isFrench, setIsFrench: () => window.location.assign(href), isLoading: false }}
    >
      <Toggle />
    </LanguageContext.Provider>
  );
}
