"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Carousel from "@/components/ui/Carousel";
import { BilingualPage } from "@/lib/data/content";

const carouselImages = [
  "/images/carousel/argentic.jpg",
  "/images/carousel/posing.jpg",
  "/images/carousel/leaving.jpg",
  "/images/carousel/yesday.jpg",
];
const carouselAlts = [
  "Band portrait inside an abandoned warehouse",
  "Band posing together in dilapidated building",
  "Band leaving the warehouse after rehearsal and shoot",
  "Still of the band in Yes Day music video shoot",
];
export default function AboutClient({ french, english }: BilingualPage) {
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
        images={carouselImages}
        altTexts={carouselAlts}
        caption={
          isFrench ? "Galerie de photos du groupe" : "Band photo gallery"
        }
      />
    </>
  );
}
