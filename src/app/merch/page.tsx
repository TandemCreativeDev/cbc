"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Page } from "@/utils/types";

const french: Page = {
  title: "Boutique",
  content: "A venir bientôt!",
};

const english: Page = {
  title: "Merch",
  content: "Coming soon!",
};

export default function Tour() {
  const { isFrench } = useLanguage();
  const pageContent = isFrench ? french : english;

  return (
    <>
      <h1 className="text-4xl font-blanch mb-6">{pageContent.title}</h1>
      <p className="text-lg leading-relaxed mb-8">{pageContent.content}</p>
    </>
  );
}
