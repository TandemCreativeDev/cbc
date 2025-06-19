import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Music",
};

const MusicClient = dynamic(() => import("./_components/MusicClient"), {
  ssr: false,
});

export default function MusicPage() {
  return <MusicClient />;
}
