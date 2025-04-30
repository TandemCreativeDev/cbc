"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  const { isFrench } = useLanguage();
  return (
    <footer className="bg-transparent flex flex-col justify-center align-bottom gap-4 mb-3">
      <SocialLinks />
      <div className="flex flex-col justify-center">
        <span className="flex justify-center">
          &copy; {new Date().getFullYear()} Clark&apos;s Bowling Club.{" "}
          {isFrench ? "Tous droits réservés" : "All rights reserved"}.
        </span>
        <div className="flex flex-row gap-1 justify-center">
          <Link
            href="https://runintandem.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-clarks-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-clarks-orange focus:ring-offset-2 focus:ring-offset-transparent transition-colors"
            aria-label="Visit the Tandem Creative Dev website"
            role="link"
          >
            Tandem Creative Dev
          </Link>
        </div>
      </div>
    </footer>
  );
}
