import type { Metadata } from "next";
import { getMusicItems } from "@/lib/data/content";
import MusicClient from "./_components/MusicClient";

export const metadata: Metadata = {
  title: "Music",
};

export default async function MusicPage() {
  return <MusicClient iFrames={await getMusicItems()} />;
}
