"use client";

import { useLanguage } from "@/context/LanguageContext";
import { TourDateType } from "@/utils/types";
import TourDatesContainer from "./TourDatesContainer";

interface TourDatesListsProps {
  futureGigs: TourDateType[];
  pastGigs: TourDateType[];
}

export default function TourDatesLists({
  futureGigs,
  pastGigs,
}: TourDatesListsProps) {
  const { isFrench } = useLanguage();

  return (
    <>
      <TourDatesContainer
        tourDates={futureGigs}
        title={isFrench ? "prochaines dates" : "upcoming events"}
      />
      <TourDatesContainer
        tourDates={pastGigs}
        title={isFrench ? "dates passées" : "past events"}
      />
    </>
  );
}
