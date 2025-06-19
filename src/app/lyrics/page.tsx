import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Lyrics",
};

const LyricsClient = dynamic(() => import("./_components/LyricsClient"), {
  ssr: false,
});

export default function LyricsPage() {
  return <LyricsClient />;
}
