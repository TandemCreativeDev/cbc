import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["GPTBot", "anthropic-ai", "Claude-Web", "CCBot"],
        allow: "/",
        crawlDelay: 2,
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "DuckDuckBot",
          "facebookexternalhit",
        ],
        allow: "/",
      },
      {
        userAgent: ["AhrefsBot", "MJ12bot", "DotBot", "SemrushBot"],
        disallow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/_next/",
          "/api/",
          "*.js",
          "*.css",
          "*.json",
          "/fonts/",
          "/images/",
          "/videos/",
          "/svg/",
        ],
      },
    ],
    sitemap: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://clarksbowlingclub.com"
    }/sitemap.xml`,
  };
}
