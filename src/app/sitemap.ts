import { MetadataRoute } from "next";
import { connection } from "next/server";
import { getLyrics, getMusicItems, getTourDates } from "@/lib/data/content";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://clarksbowlingclub.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/merch`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  const dynamicPages = await getDynamicPages();
  const markdownPages = [...staticPages, ...dynamicPages].map((page) => ({
    url: page.url.replace(SITE_URL, `${SITE_URL}`) + ".md",
    lastModified: page.lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [...staticPages, ...dynamicPages, ...markdownPages];
}

async function getDynamicPages(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [];

  try {
    const musicItems = await getMusicItems();
    if (musicItems.length > 0) {
      pages.push({
        url: `${SITE_URL}/music`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }

    const lyricsItems = await getLyrics();
    if (lyricsItems.length > 0) {
      pages.push({
        url: `${SITE_URL}/lyrics`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    const tourItems = await getTourDates();
    if (tourItems.length > 0) {
      pages.push({
        url: `${SITE_URL}/tour`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  } catch (error) {
    console.error("Error fetching dynamic content for sitemap:", error);
  }

  return pages;
}
