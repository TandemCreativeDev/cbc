"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Carousel from "@/components/ui/Carousel";
import type { BilingualPage, CarouselPhoto } from "@/lib/data/content";

export default function AboutClient({
  french,
  english,
  carousel,
}: BilingualPage & { carousel: CarouselPhoto[] }) {
  const { isFrench } = useLanguage();
  const pageContent = isFrench ? french : english;

  useEffect(() => {
    document.title = `${isFrench ? "Bio" : "About"} | Clark's Bowling Club`;
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
      <h1 className="text-4xl font-blanch mb-6">{pageContent.title}</h1>
      <p className="text-lg leading-relaxed mb-8">{pageContent.content}</p>
      <Carousel
        images={carousel.map(({ src }) => src)}
        altTexts={carousel.map(({ alt }) => (isFrench ? alt.french : alt.english))}
        caption={
          isFrench ? "Galerie de photos du groupe" : "Band photo gallery"
        }
      />
    </>
  );
}
