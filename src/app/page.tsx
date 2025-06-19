import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Home",
};

const HomeClient = dynamic(() => import("./_components/HomeClient"), {
  ssr: false,
});

export default function HomePage() {
  return <HomeClient />;
}
