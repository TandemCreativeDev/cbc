import type { Metadata } from "next";
import LyricsClient from "./_components/LyricsClient";

export const metadata: Metadata = {
  title: "Lyrics",
};

export default function LyricsPage() {
  return <LyricsClient />;
}
