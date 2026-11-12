import type { Metadata } from "next";
import MusicClient from "./_components/MusicClient";

export const metadata: Metadata = {
  title: "Music",
};

export default function MusicPage() {
  return <MusicClient />;
}
