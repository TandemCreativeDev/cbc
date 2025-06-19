"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
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
  "Black and white band portrait",
  "Band posing together",
  "Leaving the stage after a show",
  "Performing at Yes Day festival",
];
const sheetTabGid = 0;

export const metadata: Metadata = {
  title: "About",
};

export default function About() {
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
    document.title = `${isFrench ? 'À propos' : 'About'} | Clark's Bowling Club`;
  }, [isFrench]);

  if (!pageContent) return <div>Loading...</div>;

  return (
    <>
      <h1 className="text-4xl font-blanch mb-6">{pageContent.title}</h1>
      <p className="text-lg leading-relaxed mb-8">{pageContent.content}</p>
      <Carousel images={carouselImages} altTexts={carouselAlts} />
    </>
  );
}
