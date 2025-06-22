"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  const { isFrench } = useLanguage();

  return (
    <footer
      className="bg-transparent flex flex-col justify-center align-bottom gap-4 mb-3"
      role="contentinfo"
    >
      <SocialLinks />

      <div className="flex flex-col justify-center">
        <div className="flex justify-center">
          <span>
            &copy; {new Date().getFullYear()} Clark&apos;s Bowling Club.{" "}
            {isFrench ? "Tous droits réservés" : "All rights reserved"}.
          </span>
        </div>

        <div className="flex flex-row gap-1 justify-center">
          <Link
            href="https://runintandem.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-clarks-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-clarks-orange focus:ring-offset-2 focus:ring-offset-transparent transition-colors"
            aria-label={
              isFrench
                ? "Visiter le site web de Tandem Creative Dev (s'ouvre dans un nouvel onglet)"
                : "Visit the Tandem Creative Dev website (opens in new tab)"
            }
          >
            Tandem Creative Dev
          </Link>
        </div>
      </div>
    </footer>
  );
}
