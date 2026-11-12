import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { getTourDates, getTourPage } from "@/lib/data/content";
import dateInPast from "@/utils/dateInPast";
import gigTime from "@/utils/gigTime";
import TourClient from "./_components/TourClient";
import TourDatesLists from "./_components/TourDatesLists";

export const metadata: Metadata = {
  title: "Tour",
};

async function TourDates() {
  const gigs = await getTourDates();
  await connection();

  const pastGigs = gigs
    .filter((gig) => dateInPast(gig.eventDate))
    .sort((a, b) => gigTime(b) - gigTime(a));
  const futureGigs = gigs
    .filter((gig) => !dateInPast(gig.eventDate))
    .sort((a, b) => gigTime(a) - gigTime(b));

  return <TourDatesLists futureGigs={futureGigs} pastGigs={pastGigs} />;
}

export default async function TourPage() {
  return (
    <TourClient {...(await getTourPage())}>
      <Suspense>
        <TourDates />
      </Suspense>
    </TourClient>
  );
}
