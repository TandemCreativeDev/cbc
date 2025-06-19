import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Tour",
};

const TourClient = dynamic(() => import("./_components/TourClient"), {
  ssr: false,
});

export default function TourPage() {
  return <TourClient />;
}
