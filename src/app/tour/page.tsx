import type { Metadata } from "next";
import TourClient from "./_components/TourClient";

export const metadata: Metadata = {
  title: "Tour",
};

export default function TourPage() {
  return <TourClient />;
}
