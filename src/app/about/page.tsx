import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "About",
};

const AboutClient = dynamic(() => import("./_components/AboutClient"), {
  ssr: false,
});

export default function AboutPage() {
  return <AboutClient />;
}
