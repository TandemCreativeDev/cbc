"use client";

import Bandcamp from "@/components/IFrame/Bandcamp";
import Youtube from "@/components/IFrame/Youtube";
import Spotify from "@/components/IFrame/Spotify";
import { useLanguage } from "@/context/LanguageContext";
import { IFrameProps } from "@/utils/types";
import fetchSheet from "@/utils/fetchSheet";
import parseCsv from "@/utils/parseCsv";
import { useEffect, useState } from "react";

const sheetTabGid = 1713768433;

export default function Music() {
  const { isFrench } = useLanguage();
  const [iFrames, setIFrames] = useState<IFrameProps[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const csvData = await fetchSheet(sheetTabGid);
        const parsedData: IFrameProps[] = parseCsv<IFrameProps>(
          csvData,
          (row) => !!row.title && !!row.type
        );

        console.log("Parsed Music Content:", parsedData);
        setIFrames(parsedData);

        const categoryKey = isFrench ? "categorie" : "category";
        const uniqueCategories = Array.from(
          new Set(
            parsedData.map(
              (item) => item[categoryKey as keyof IFrameProps] || ""
            )
          )
        );

        setCategories(uniqueCategories);
        if (uniqueCategories.length > 0) {
          setSelectedCategory(uniqueCategories[0]);
        }
      } catch (error) {
        console.error("Error fetching or parsing music content:", error);
      }
    };

    fetchContent();
  }, [isFrench]);

  const filteredIFrames =
    selectedCategory === null
      ? []
      : iFrames.filter(
          (item) =>
            item[(isFrench ? "categorie" : "category") as keyof IFrameProps] ===
            selectedCategory
        );

  return (
    <>
      <h2 className="text-4xl font-blanch mb-6">
        {isFrench ? "Musique" : "Music"}
      </h2>
      <div className="flex mb-8 space-x-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`py-2 px-4 rounded-full transition-colors duration-200 ${
              selectedCategory === category
                ? "bg-clarks-orange text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid gap-8">
        {filteredIFrames.map((item) =>
          item.type === "bandcamp" ? (
            <Bandcamp
              key={item.title}
              href={item.href}
              src={item.src}
              title={item.title}
            />
          ) : item.type === "spotify" ? (
            <Spotify key={item.title} src={item.src} title={item.title} />
          ) : (
            <Youtube key={item.title} src={item.src} title={item.title} />
          )
        )}
      </div>
    </>
  );
}
