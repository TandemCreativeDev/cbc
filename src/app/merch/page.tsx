"use client";

import { useLanguage } from "../../context/LanguageContext";
import { Page } from "../../utils/types";

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
    <div className="container mx-auto pt-28 mb-5xl max-w-5xl p-8">
      <h2 className="text-4xl font-blanch mb-6">{pageContent.title}</h2>
      <p className="text-lg leading-relaxed mb-8">{pageContent.content}</p>
    </div>
  );
}
