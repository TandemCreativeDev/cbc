"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Page, TourDateType } from "@/utils/types";
import fetchSheet from "@/utils/fetchSheet";
import parseCsv from "@/utils/parseCsv";
import parsePageCsv from "@/utils/parsePageCsv";
import dateInPast from "@/utils/dateInPast";
import TourDatesContainer from "./TourDatesContainer";

const sheetTabGid = 127405583; // Main Tour page content
const sheetTabGidTourDates = 572869052; // Tour dates

function gigTime(gig: TourDateType): number {
  const [day, month, year] = gig.eventDate.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
}

export default function TourClient() {
  const { isFrench } = useLanguage();
  const [englishContent, setEnglishContent] = useState<Page | null>(null);
  const [frenchContent, setFrenchContent] = useState<Page | null>(null);
  const [gigs, setGigs] = useState<TourDateType[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const pageCsvData = await fetchSheet(sheetTabGid);
        const parsedPageContent = parsePageCsv(pageCsvData);
        setEnglishContent(parsedPageContent[1]);
        setFrenchContent(parsedPageContent[0]);

        const tourDatesCsvData = await fetchSheet(sheetTabGidTourDates);
        const parsedGigs = parseCsv<TourDateType>(
          tourDatesCsvData,
          (row) => !!row.eventDate
        );
        setGigs(parsedGigs);
      } catch (error) {
        console.error("Error fetching or parsing content:", error);
      }
    };

    fetchContent();
  }, []);

  const pageContent = isFrench ? frenchContent : englishContent;

  useEffect(() => {
    document.title = `${isFrench ? "Tournée" : "Tour"} | Clark's Bowling Club`;
  }, [isFrench]);

  const pastGigs = gigs
    .filter((gig) => dateInPast(gig.eventDate))
    .sort((a, b) => gigTime(b) - gigTime(a));
  const futureGigs = gigs
    .filter((gig) => !dateInPast(gig.eventDate))
    .sort((a, b) => gigTime(a) - gigTime(b));

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
      <TourDatesContainer
        tourDates={futureGigs}
        title={isFrench ? "prochaines dates" : "upcoming events"}
      />
      <TourDatesContainer
        tourDates={pastGigs}
        title={isFrench ? "dates passées" : "past events"}
      />
    </>
  );
}
