import type { Metadata } from "next";
import { getAboutPage } from "@/lib/data/content";
import AboutClient from "./_components/AboutClient";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage() {
  return <AboutClient {...(await getAboutPage())} />;
}
