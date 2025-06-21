"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Page } from "@/utils/types";
import Carousel from "@/components/ui/Carousel";
import parsePageCsv from "@/utils/parsePageCsv";
import fetchSheet from "@/utils/fetchSheet";

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
const sheetTabGid = 0;

export default function AboutClient() {
  const { isFrench } = useLanguage();
  const [englishContent, setEnglishContent] = useState<Page | null>(null);
  const [frenchContent, setFrenchContent] = useState<Page | null>(null);
  const [pageContent, setPageContent] = useState<Page | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const csvData = await fetchSheet(sheetTabGid);
        const parsedContent = parsePageCsv(csvData);
        setEnglishContent(parsedContent[1]);
        setFrenchContent(parsedContent[0]);
      } catch (error) {
        console.error("Error fetching or parsing page content:", error);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    setPageContent(isFrench ? frenchContent : englishContent);
  }, [isFrench, frenchContent, englishContent]);

  useEffect(() => {
    document.title = `${isFrench ? "Bio" : "About"} | Clark's Bowling Club`;
  }, [isFrench]);

  if (!pageContent) return <div>Loading...</div>;

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
