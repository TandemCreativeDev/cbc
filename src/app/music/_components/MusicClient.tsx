"use client";

import Bandcamp from "./Bandcamp";
import Youtube from "./Youtube";
import Spotify from "./Spotify";
import { useLanguage } from "@/context/LanguageContext";
import { IFrameProps } from "@/utils/types";
import fetchSheet from "@/utils/fetchSheet";
import parseCsv from "@/utils/parseCsv";
import { useEffect, useState } from "react";
import FilterNavigation from "@/components/layout/FilterNavigation";

const sheetTabGid = 1713768433;

export default function MusicClient() {
  const { isFrench } = useLanguage();
  const [iFrames, setIFrames] = useState<IFrameProps[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    string | number | readonly string[] | undefined
  >("Live Performances");
  const [announcement, setAnnouncement] = useState("");

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

  useEffect(() => {
    document.title = `${isFrench ? "Musique" : "Music"} | Clark's Bowling Club`;
  }, [isFrench]);

  useEffect(() => {
    setAnnouncement(
      isFrench
        ? `${filteredIFrames.length} éléments dans la catégorie ${selectedCategory}`
        : `${filteredIFrames.length} items in category ${selectedCategory}`
    );
  }, [filteredIFrames.length, selectedCategory, isFrench]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Clear announcement briefly to ensure new one is read
    setAnnouncement("");
  };

  return (
    <>
      <h1 className="text-4xl font-blanch mb-6">
        {isFrench ? "Musique" : "Music"}
      </h1>

      <FilterNavigation
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        ariaLabel={
          isFrench
            ? "Filtres de catégories musicales"
            : "Music category filters"
        }
        announcementId="category-announcement"
      />

      <section
        id={
          selectedCategory
            ? String(selectedCategory)
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "") + "-content"
            : "music-content"
        }
        aria-label={
          isFrench
            ? `Contenu de la catégorie ${selectedCategory}`
            : `${selectedCategory} category content`
        }
      >
        <ul className="space-y-8">
          {filteredIFrames.map((item) => (
            <li key={item.title}>
              {item.type === "bandcamp" ? (
                <Bandcamp href={item.href} src={item.src} title={item.title} />
              ) : item.type === "spotify" ? (
                <Spotify src={item.src} title={item.title} />
              ) : (
                <Youtube src={item.src} title={item.title} />
              )}
            </li>
          ))}
        </ul>
      </section>

      <div id="category-announcement" aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </>
  );
}
