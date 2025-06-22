"use client";

import ContactForm from "@/app/contact/_components/ContactForm";
import { useLanguage } from "@/context/LanguageContext";
import { Page } from "@/utils/types";
import { useEffect, useState } from "react";

const french: Page = {
  title: "Contact",
  content: "Envoyez-nous un message",
};

const english: Page = {
  title: "Contact",
  content: "Send us a message",
};

export default function ContactClient() {
  const { isFrench } = useLanguage();
  const pageContent = isFrench ? french : english;
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    document.title = `${
      isFrench ? "Contact" : "Contact"
    } | Clark's Bowling Club`;
    setIsLoaded(true);
  }, [isFrench]);

  if (!isLoaded)
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">
          {isFrench ? "Chargement du contenu..." : "Loading content..."}
        </span>
        <div aria-hidden="true">{isFrench ? "Chargement..." : "Loading..."}.</div>
      </div>
    );

  return (
    <>
      <h1 className="text-4xl font-blanch mb-6">{pageContent.title}</h1>
      <ContactForm legend={pageContent.content} />
    </>
  );
}
