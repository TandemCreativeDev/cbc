"use client";

import { useLanguage } from "@/context/LanguageContext";
import fetchSheet from "@/utils/fetchSheet";
import parseCsv from "@/utils/parseCsv";
import { useEffect, useState } from "react";
import type { Metadata } from "next";
import clsx from "clsx";
import { LyricsProps } from "@/utils/types";
import FilterButton from "@/components/ui/FilterButton";

const sheetTabGid = 145198726;

export const metadata: Metadata = {
  title: "Lyrics",
};

export default function Music() {
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
    document.title = `${isFrench ? "Paroles" : "Lyrics"} | Clark's Bowling Club`;
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

  return (
    <>
      <h1 className="text-4xl font-blanch mb-6">
        {isFrench ? "Paroles" : "Lyrics"}
      </h1>
      <div className="flex justify-between m-auto mb-10 overflow-x-scroll gap-3 no-scrollbar">
        {albums.map((album) => (
          <FilterButton
            key={album}
            filter={album}
            isSelected={selectedAlbum === album}
            onClick={() => setSelectedAlbum(album)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="grid gap-4">
            {filteredSongs.map((song) => (
              <button
                key={song.title}
                className={clsx(
                  "p-4 border text-left transition-colors duration-200 focus:ring-clarks-orange focus-visible:ring-2 focus:outline-none",
                  selectedSong?.title === song.title
                    ? "bg-white text-black"
                    : "bg-transparent text-white hover:border-2 hover:border-clarks-orange"
                )}
                onClick={() => setSelectedSong(song)}
              >
                <h3 className="font-bold">{song.title}</h3>
                {song.date && <p className="text-sm">{song.date}</p>}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          {selectedSong && (
            <div className="bg-transparent p-6 border-2">
              <h2 className="text-2xl font-bold mb-4">{selectedSong.title}</h2>
              <div className="whitespace-pre-wrap">
                {isFrench && selectedSong.paroles
                  ? selectedSong.paroles
                  : selectedSong.lyrics}
              </div>
            </div>
          )}
        </div>
      </div>
      <div aria-live="polite" className="sr-only">{albumAnnouncement}</div>
      <div aria-live="polite" className="sr-only">{songAnnouncement}</div>
    </>
  );
}
