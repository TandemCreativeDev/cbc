import type { Metadata } from "next";
import { getLyrics } from "@/lib/data/content";
import LyricsClient from "./_components/LyricsClient";

export const metadata: Metadata = {
  title: "Lyrics",
};

export default async function LyricsPage() {
  return <LyricsClient lyrics={await getLyrics()} />;
}
