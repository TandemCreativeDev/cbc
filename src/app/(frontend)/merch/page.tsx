import type { Metadata } from "next";
import MerchClient from "./_components/MerchClient";

export const metadata: Metadata = {
  title: "Merch",
};

export default function MerchPage() {
  return <MerchClient />;
}
