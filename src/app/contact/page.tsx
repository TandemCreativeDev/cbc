"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Page } from "@/utils/types";

const french: Page = {
  title: "Contact",
  content: "clarksbowlingclub@gmail.com",
};

const english: Page = {
  title: "Contact",
  content: "clarksbowlingclub@gmail.com",
};

export default function Tour() {
  const { isFrench } = useLanguage();
  const pageContent = isFrench ? french : english;

  return (
    <>
      <h2 className="text-4xl font-blanch mb-6">{pageContent.title}</h2>
      <p className="text-lg leading-relaxed mb-8">{pageContent.content}</p>
    </>
  );
}
