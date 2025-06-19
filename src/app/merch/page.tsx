import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Merch",
};

const MerchClient = dynamic(() => import("./_components/MerchClient"), {
  ssr: false,
});

export default function MerchPage() {
  return <MerchClient />;
}
