import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Contact",
};

const ContactClient = dynamic(() => import("./_components/ContactClient"), {
  ssr: false,
});

export default function ContactPage() {
  return <ContactClient />;
}
