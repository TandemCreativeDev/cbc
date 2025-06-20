"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Page, TourDateType } from "@/utils/types";
import fetchSheet from "@/utils/fetchSheet";
import parseCsv from "@/utils/parseCsv";
import parsePageCsv from "@/utils/parsePageCsv";
import dateInPast from "@/utils/dateInPast";
import TourDatesContainer from "@/components/TourDates/TourDatesContainer";

const sheetTabGid = 127405583; // Main Tour page content
const sheetTabGidTourDates = 572869052; // Tour dates

export default function TourClient() {
  const { isFrench } = useLanguage();
  const [englishContent, setEnglishContent] = useState<Page | null>(null);
  const [frenchContent, setFrenchContent] = useState<Page | null>(null);
  const [pageContent, setPageContent] = useState<Page | null>(null);
  const [gigs, setGigs] = useState<TourDateType[]>([]);
  const [futureGigs, setFutureGigs] = useState<TourDateType[]>([]);
  const [pastGigs, setPastGigs] = useState<TourDateType[]>([]);

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

  useEffect(() => {
    setPageContent(isFrench ? frenchContent : englishContent);
  }, [isFrench, englishContent, frenchContent]);

  useEffect(() => {
    document.title = `${isFrench ? "Tournée" : "Tour"} | Clark's Bowling Club`;
  }, [isFrench]);

  useEffect(() => {
    const past: TourDateType[] = [];
    const future: TourDateType[] = [];

    gigs.forEach((gig) => {
      if (dateInPast(gig.eventDate)) {
        past.push(gig);
      } else {
        future.push(gig);
      }
    });

    past.sort((b, a) => {
      const [dayA, monthA, yearA] = a.eventDate.split("/").map(Number);
      const [dayB, monthB, yearB] = b.eventDate.split("/").map(Number);
      return (
        new Date(yearA, monthA - 1, dayA).getTime() -
        new Date(yearB, monthB - 1, dayB).getTime()
      );
    });

    future.sort((a, b) => {
      const [dayA, monthA, yearA] = a.eventDate.split("/").map(Number);
      const [dayB, monthB, yearB] = b.eventDate.split("/").map(Number);
      return (
        new Date(yearA, monthA - 1, dayA).getTime() -
        new Date(yearB, monthB - 1, dayB).getTime()
      );
    });

    setPastGigs(past);
    setFutureGigs(future);
  }, [gigs]);

  if (!pageContent) return <div>Loading...</div>;

  return (
    <>
      <h2 className="text-4xl mb-6 font-blanch">{pageContent.title}</h2>
      <p className="text-lg leading-relaxed mb-8">{pageContent.content}</p>
      <div className="mt-10">
        <TourDatesContainer
          tourDates={futureGigs}
          title={isFrench ? "prochaines dates" : "upcoming events"}
        />
        <TourDatesContainer
          tourDates={pastGigs}
          title={isFrench ? "dates passées" : "past events"}
        />
      </div>
    </>
  );
}
