import fetchSheet from "@/utils/fetchSheet";
import parsePageCsv from "@/utils/parsePageCsv";
import parseCsv from "@/utils/parseCsv";
import { IFrameProps, LyricsProps, TourDateType } from "@/utils/types";

export async function GET() {
  try {
    const content = await generateLLMsTxt();

    return new Response(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating llms.txt:", error);
    return new Response("Error generating content", { status: 500 });
  }
}

async function generateLLMsTxt(): Promise<string> {
  const sections: string[] = [];

  sections.push("# Clark's Bowling Club");
  sections.push("");
  sections.push(
    "A 6-piece funk/pop band based in Lyon, France. Inspired by Jungle and Deluxe, bringing modern disco-funk, hip-hop, and jazz to the vibrant music scene."
  );
  sections.push("");
  sections.push("## About");

  try {
    const aboutData = await fetchSheet(0);
    const aboutContent = parsePageCsv(aboutData);
    if (aboutContent[1]?.content) {
      sections.push(aboutContent[1].content);
      sections.push("");
    }
  } catch (error) {
    console.error("Error fetching about content:", error);
  }

  sections.push("## Music");
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
      sections.push(`### ${category}`);
      const categoryItems = musicItems.filter(
        (item) => (item.category || item.categorie) === category
      );
      categoryItems.forEach((item) => {
        sections.push(`- ${item.title}`);
      });
      sections.push("");
    }
  } catch (error) {
    console.error("Error fetching music content:", error);
  }

  sections.push("## Tour Dates");
  try {
    const tourData = await fetchSheet(572869052);
    const tourItems = parseCsv<TourDateType>(
      tourData,
      (row) => !!row.eventDate
    );

    const now = new Date();
    const futureGigs = tourItems
      .filter((gig) => {
        const [day, month, year] = gig.eventDate.split("/").map(Number);
        const gigDate = new Date(year, month - 1, day);
        return gigDate >= now;
      })
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.eventDate.split("/").map(Number);
        const [dayB, monthB, yearB] = b.eventDate.split("/").map(Number);
        return (
          new Date(yearA, monthA - 1, dayA).getTime() -
          new Date(yearB, monthB - 1, dayB).getTime()
        );
      });

    if (futureGigs.length > 0) {
      sections.push("### Upcoming Shows");
      futureGigs.forEach((gig) => {
        const date = new Date(
          gig.eventDate.split("/").reverse().join("-")
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        sections.push(`- ${date}: ${gig.venue}, ${gig.location}`);
      });
      sections.push("");
    }
  } catch (error) {
    console.error("Error fetching tour content:", error);
  }

  sections.push("## Lyrics");
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
      sections.push(`### ${album}`);
      const albumSongs = lyricsItems.filter((item) => item.album === album);
      albumSongs.forEach((song) => {
        sections.push(`#### ${song.title}`);
        sections.push("");
        sections.push(song.lyrics);
        sections.push("");
      });
    }
  } catch (error) {
    console.error("Error fetching lyrics content:", error);
  }

  sections.push("## Contact");
  sections.push("Email: contact@clarksbowlingclub.com");
  sections.push("Website: https://clarksbowlingclub.com");
  sections.push("");
  sections.push("## Social Media");
  sections.push("- Facebook: https://facebook.com/clarksbowlingclub");
  sections.push("- Instagram: https://instagram.com/clarksbowlingclub");
  sections.push(
    "- Spotify: https://open.spotify.com/artist/4K3IjWGpwXYwjyNONZwvMZ"
  );
  sections.push("- YouTube: https://youtube.com/@clarksbowlingclub");
  sections.push("- SoundCloud: https://soundcloud.com/clarksbowlingclub");
  sections.push("- TikTok: https://tiktok.com/@clarksbowlingclub");

  return sections.join("\n");
}
