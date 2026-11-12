import type { Metadata } from "next";
import AboutClient from "./_components/AboutClient";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return <AboutClient />;
}
