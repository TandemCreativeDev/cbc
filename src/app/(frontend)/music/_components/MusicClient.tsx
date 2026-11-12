"use client";

import Bandcamp from "./Bandcamp";
import Youtube from "./Youtube";
import Spotify from "./Spotify";
import { useLanguage } from "@/context/LanguageContext";
import { IFrameProps } from "@/utils/types";
import { useEffect, useState } from "react";
import FilterNavigation from "@/components/layout/FilterNavigation";

export default function MusicClient({ iFrames }: { iFrames: IFrameProps[] }) {
  const { isFrench } = useLanguage();
  const [pickedCategory, setPickedCategory] = useState<string>();

  const categoryKey = isFrench ? "categorie" : "category";
  const categories = Array.from(
    new Set(iFrames.map((item) => item[categoryKey] || ""))
  );
  const selectedCategory =
    pickedCategory !== undefined && categories.includes(pickedCategory)
      ? pickedCategory
      : categories[0];

  const filteredIFrames = iFrames.filter(
    (item) => (item[categoryKey] || "") === selectedCategory
  );

  useEffect(() => {
    document.title = `${isFrench ? "Musique" : "Music"} | Clark's Bowling Club`;
  }, [isFrench]);

  const announcement = isFrench
    ? `${filteredIFrames.length} éléments dans la catégorie ${selectedCategory}`
    : `${filteredIFrames.length} items in category ${selectedCategory}`;

  const handleCategoryChange = (category: string) => {
    setPickedCategory(category);
  };

  if (iFrames.length === 0)
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
