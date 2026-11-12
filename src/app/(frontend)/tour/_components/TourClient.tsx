"use client";

import { ReactNode, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { BilingualPage } from "@/lib/data/content";

export default function TourClient({
  french,
  english,
  children,
}: BilingualPage & { children: ReactNode }) {
  const { isFrench } = useLanguage();
  const pageContent = isFrench ? french : english;

  useEffect(() => {
    document.title = `${isFrench ? "Tournée" : "Tour"} | Clark's Bowling Club`;
  }, [isFrench]);

  if (!pageContent)
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">
          {isFrench ? "Chargement du contenu..." : "Loading content..."}
        </span>
        <div aria-hidden="true">{isFrench ? "Chargement..." : "Loading..."}.</div>
      </div>
    );

  return (
    <>
      <h1 className="text-4xl mb-6 font-blanch">{pageContent.title}</h1>
      <p className="text-lg leading-relaxed mb-8">{pageContent.content}</p>
      {children}
    </>
  );
}
