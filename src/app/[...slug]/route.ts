import { NextRequest } from "next/server";
import fetchSheet from "@/utils/fetchSheet";
import parsePageCsv from "@/utils/parsePageCsv";
import parseCsv from "@/utils/parseCsv";
import { IFrameProps, LyricsProps, TourDateType } from "@/utils/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug: slugArray } = await params;
  const slug = slugArray.join("/");

  if (!slug.endsWith(".md")) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const page = slug.replace(".md", "");
    const content = await generatePageMarkdown(page);

    if (!content) {
      return new Response("Page not found", { status: 404 });
    }

    return new Response(content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error(`Error generating markdown for page ${slug}:`, error);
    return new Response("Error generating content", { status: 500 });
  }
}

async function generatePageMarkdown(page: string): Promise<string | null> {
  const sections: string[] = [];

  switch (page) {
    case "home":
    case "":
      sections.push("# Clark's Bowling Club");
      sections.push("");
      sections.push(
        "A 6-piece funk/pop band based in Lyon, France. Inspired by the likes of Jungle and Deluxe, their music brings a modern twist to disco-funk, hip-hop, and jazz genres, breathing new life into the vibrant music scene."
      );
      break;

    case "about":
      try {
        const aboutData = await fetchSheet(0);
        const aboutContent = parsePageCsv(aboutData);
        if (aboutContent[1]) {
          sections.push(`# ${aboutContent[1].title}`);
          sections.push("");
          sections.push(aboutContent[1].content);
        }
      } catch {
        return null;
      }
      break;

    case "music":
      sections.push("# Music");
      sections.push("");
      try {
        const musicData = await fetchSheet(1713768433);
        const musicItems = parseCsv<IFrameProps>(
          musicData,
          (row) => !!row.title && !!row.type
        );

        const categories = [
          ...new Set(
            musicItems
              .map((item) => item.category || item.categorie)
              .filter(Boolean)
          ),
        ];

        for (const category of categories) {
          sections.push(`## ${category}`);
          sections.push("");
          const categoryItems = musicItems.filter(
            (item) => (item.category || item.categorie) === category
          );
          categoryItems.forEach((item) => {
            sections.push(`### ${item.title}`);
            if (item.src) {
              sections.push(`[Listen here](${item.src})`);
            }
            sections.push("");
          });
        }
      } catch {
        return null;
      }
      break;

    case "tour":
      sections.push("# Tour");
      sections.push("");
      try {
        const tourPageData = await fetchSheet(127405583);
        const tourPageContent = parsePageCsv(tourPageData);
        if (tourPageContent[1]?.content) {
          sections.push(tourPageContent[1].content);
          sections.push("");
        }

        const tourData = await fetchSheet(572869052);
        const tourItems = parseCsv<TourDateType>(
          tourData,
          (row) => !!row.eventDate
        );

        const now = new Date();
        const futureGigs = tourItems.filter((gig) => {
          const [day, month, year] = gig.eventDate.split("/").map(Number);
          const gigDate = new Date(year, month - 1, day);
          return gigDate >= now;
        });

        const pastGigs = tourItems.filter((gig) => {
          const [day, month, year] = gig.eventDate.split("/").map(Number);
          const gigDate = new Date(year, month - 1, day);
          return gigDate < now;
        });

        if (futureGigs.length > 0) {
          sections.push("## Upcoming Events");
          sections.push("");
          futureGigs.forEach((gig) => {
            const date = new Date(
              gig.eventDate.split("/").reverse().join("-")
            ).toLocaleDateString("en-GB");
            sections.push(`**${date}** - ${gig.venue}, ${gig.location}`);
            if (gig.ticketUrl) {
              sections.push(`[Buy Tickets](${gig.ticketUrl})`);
            }
            sections.push("");
          });
        }

        if (pastGigs.length > 0) {
          sections.push("## Past Events");
          sections.push("");
          pastGigs.slice(0, 10).forEach((gig) => {
            const date = new Date(
              gig.eventDate.split("/").reverse().join("-")
            ).toLocaleDateString("en-GB");
            sections.push(`**${date}** - ${gig.venue}, ${gig.location}`);
          });
        }
      } catch {
        return null;
      }
      break;

    case "lyrics":
      sections.push("# Lyrics");
      sections.push("");
      try {
        const lyricsData = await fetchSheet(145198726);
        const lyricsItems = parseCsv<LyricsProps>(
          lyricsData,
          (row) => !!row.title && !!row.lyrics
        );

        const albums = [
          ...new Set(lyricsItems.map((item) => item.album).filter(Boolean)),
        ];

        for (const album of albums) {
          sections.push(`## ${album}`);
          sections.push("");
          const albumSongs = lyricsItems.filter((item) => item.album === album);
          albumSongs.forEach((song) => {
            sections.push(`### ${song.title}`);
            if (song.date) {
              sections.push(`*Released: ${song.date}*`);
            }
            sections.push("");
            sections.push("```");
            sections.push(song.lyrics);
            sections.push("```");
            sections.push("");
          });
        }
      } catch {
        return null;
      }
      break;

    case "contact":
      sections.push("# Contact");
      sections.push("");
      sections.push("Get in touch with Clark's Bowling Club");
      sections.push("");
      sections.push("## Contact Information");
      sections.push("- Email: contact@clarksbowlingclub.com");
      sections.push("- Website: https://clarksbowlingclub.com");
      sections.push("");
      sections.push("## Social Media");
      sections.push("- [Facebook](https://facebook.com/clarksbowlingclub)");
      sections.push("- [Instagram](https://instagram.com/clarksbowlingclub)");
      sections.push(
        "- [Spotify](https://open.spotify.com/artist/4K3IjWGpwXYwjyNONZwvMZ)"
      );
      sections.push("- [YouTube](https://youtube.com/@clarksbowlingclub)");
      sections.push("- [SoundCloud](https://soundcloud.com/clarksbowlingclub)");
      sections.push("- [TikTok](https://tiktok.com/@clarksbowlingclub)");
      break;

    case "privacy-policy":
      sections.push("# Privacy Policy");
      sections.push("");
      sections.push("**Last Updated: 10 March 2025**");
      sections.push("");
      sections.push("## 1. Introduction");
      sections.push(
        "Welcome to Clarks Bowling Club. We are committed to protecting your privacy and ensuring that your personal information is handled securely."
      );
      sections.push("");
      sections.push("## 2. What Information We Collect");
      sections.push(
        "When you submit an inquiry through our contact form, we collect:"
      );
      sections.push("- Name: First and last name");
      sections.push("- Company Name (if provided)");
      sections.push("- Email Address");
      sections.push("- Phone Number (if provided)");
      sections.push("- Message Content");
      sections.push("");
      sections.push("## 3. How We Use Your Information");
      sections.push(
        "We use the information you provide solely for responding to your inquiry and communicating with you regarding your request."
      );
      sections.push("");
      sections.push(
        "**We do not store your information in a database, use it for marketing, or share it with third parties.**"
      );
      break;

    case "merch":
      sections.push("# Merch");
      sections.push("");
      sections.push("Coming soon!");
      break;

    default:
      return null;
  }

  return sections.join("\n");
}
