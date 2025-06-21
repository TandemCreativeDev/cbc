"use client";

import { useLanguage } from "@/context/LanguageContext";
import fetchSheet from "@/utils/fetchSheet";
import parseCsv from "@/utils/parseCsv";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { LyricsProps } from "@/utils/types";
import FilterNavigation from "@/components/layout/FilterNavigation";

const sheetTabGid = 145198726;

export default function LyricsClient() {
  const { isFrench } = useLanguage();
  const [lyrics, setLyrics] = useState<LyricsProps[]>([]);
  const [albums, setAlbums] = useState<string[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | undefined>();
  const [selectedSong, setSelectedSong] = useState<LyricsProps | undefined>();
  const [albumAnnouncement, setAlbumAnnouncement] = useState("");
  const [songAnnouncement, setSongAnnouncement] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const csvData = await fetchSheet(sheetTabGid);
        const parsedData: LyricsProps[] = parseCsv<LyricsProps>(
          csvData,
          (row) => !!row.title && !!row.lyrics
        );

        console.log("Parsed Lyrics Content:", parsedData);
        setLyrics(parsedData);

        const uniqueAlbums = Array.from(
          new Set(parsedData.map((item) => item.album || ""))
        ).filter(Boolean);

        setAlbums(uniqueAlbums);
        if (uniqueAlbums.length > 0) {
          setSelectedAlbum(uniqueAlbums[0]);
        }
      } catch (error) {
        console.error("Error fetching or parsing music content:", error);
      }
    };

    fetchContent();
  }, [isFrench]);

  useEffect(() => {
    if (selectedAlbum) {
      const filteredSongs = lyrics.filter(
        (song) => song.album === selectedAlbum
      );
      if (filteredSongs.length > 0 && !selectedSong) {
        setSelectedSong(filteredSongs[0]);
      } else if (
        filteredSongs.length > 0 &&
        selectedSong &&
        selectedSong.album !== selectedAlbum
      ) {
        setSelectedSong(filteredSongs[0]);
      }
    }
  }, [selectedAlbum, lyrics, selectedSong]);

  const filteredSongs = selectedAlbum
    ? lyrics.filter((song) => song.album === selectedAlbum)
    : [];

  useEffect(() => {
    document.title = `${
      isFrench ? "Paroles" : "Lyrics"
    } | Clark's Bowling Club`;
  }, [isFrench]);

  useEffect(() => {
    setAlbumAnnouncement(
      isFrench
        ? `${filteredSongs.length} chansons dans l'album ${selectedAlbum}`
        : `${filteredSongs.length} songs from album ${selectedAlbum}`
    );
  }, [filteredSongs.length, selectedAlbum, isFrench]);

  useEffect(() => {
    if (selectedSong) {
      setSongAnnouncement(
        isFrench
          ? `Paroles affichées pour ${selectedSong.title}`
          : `Showing lyrics for ${selectedSong.title}`
      );
    }
  }, [selectedSong, isFrench]);

  const handleAlbumChange = (album: string) => {
    setSelectedAlbum(album);
    // Clear announcements briefly to ensure new ones are read
    setAlbumAnnouncement("");
    setSongAnnouncement("");
  };

  const handleSongSelect = (song: LyricsProps) => {
    setSelectedSong(song);
    setSongAnnouncement("");
  };

  // Create section IDs
  const selectedAlbumId = selectedAlbum
    ? selectedAlbum
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    : "lyrics";

  return (
    <>
      <h1 className="text-4xl font-blanch mb-6">
        {isFrench ? "Paroles" : "Lyrics"}
      </h1>

      <FilterNavigation
        categories={albums}
        selectedCategory={selectedAlbum}
        onCategoryChange={handleAlbumChange}
        ariaLabel={isFrench ? "Filtres d'albums" : "Album filters"}
        announcementId="album-announcement"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section
          id={`${selectedAlbumId}-songs`}
          aria-labelledby={`${selectedAlbumId}-songs-heading`}
          className="md:col-span-1"
        >
          <h2 id={`${selectedAlbumId}-songs-heading`} className="sr-only">
            {isFrench
              ? `Chansons de l'album ${selectedAlbum}`
              : `Songs from ${selectedAlbum} album`}
          </h2>

          <ul className="space-y-4">
            {filteredSongs.map((song) => (
              <li key={song.title}>
                <button
                  className={clsx(
                    "p-4 border text-left transition-colors duration-200 w-full focus:ring-clarks-orange focus-visible:ring-2 focus:outline-none",
                    selectedSong?.title === song.title
                      ? "bg-white text-black"
                      : "bg-transparent text-white hover:border-2 hover:border-clarks-orange"
                  )}
                  onClick={() => handleSongSelect(song)}
                  aria-pressed={selectedSong?.title === song.title}
                  aria-describedby="song-announcement"
                >
                  <h3 className="font-bold">{song.title}</h3>
                  {song.date && <p className="text-sm">{song.date}</p>}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {selectedSong && (
          <>
            <section
              id={`${selectedAlbumId}-lyrics-display`}
              aria-labelledby={`${selectedAlbumId}-lyrics-heading`}
              className="whitespace-pre-wrap bg-transparent p-6 border-2 md:col-span-2"
              role="article"
              aria-label={
                isFrench
                  ? `Paroles pour ${selectedSong.title}`
                  : `Lyrics for ${selectedSong.title}`
              }
            >
              <h2
                id={`${selectedAlbumId}-lyrics-heading`}
                className="text-2xl font-bold mb-4"
              >
                {selectedSong.title}
              </h2>
              {isFrench && selectedSong.paroles
                ? selectedSong.paroles
                : selectedSong.lyrics}
            </section>
          </>
        )}
      </div>

      <div id="album-announcement" aria-live="polite" className="sr-only">
        {albumAnnouncement}
      </div>

      <div id="song-announcement" aria-live="polite" className="sr-only">
        {songAnnouncement}
      </div>
    </>
  );
}
