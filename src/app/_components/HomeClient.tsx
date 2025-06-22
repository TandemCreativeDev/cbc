"use client";

import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { FaVolumeMute, FaVolumeUp, FaPause, FaPlay } from "react-icons/fa";
import SpinningLogo from "./SpinningLogo";
import Image from "next/image";
import StaticLogo from "./StaticLogo";

export default function HomeClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [play, setPlay] = useState(true);
  const { isFrench } = useLanguage();

  useEffect(() => {
    document.title = `${isFrench ? "Accueil" : "Home"} | Clark's Bowling Club`;
  }, [isFrench]);

  const backgroundClasses =
    "absolute inset-0 top-0 left-0 min-h-full w-auto object-cover";

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setPlay(true);
      } else {
        videoRef.current.pause();
        setPlay(false);
      }
    }
  };

  return (
    <>
      {/* Background video */}
      <div className="fixed inset-0 -z-10">
        <video
          ref={videoRef}
          className={`${backgroundClasses} motion-reduce:hidden brightness-50`}
          src="/videos/teaser.mp4"
          autoPlay
          loop
          muted={muted}
          aria-hidden="true"
        />
        <Image
          src="/images/home.png"
          alt="Band performing on stage"
          fill
          className={`${backgroundClasses} motion-reduce:block hidden`}
        />
      </div>

      {/* Logo elements - decorative */}
      <div className="fixed top-[5rem] left-0 w-full h-[calc(100vh-11rem)] pointer-events-none z-50">
        <SpinningLogo />
        <StaticLogo />
      </div>

      {/* Video controls */}
      <button
        className="absolute top-5 left-16 md:top-auto md:left-auto md:bottom-5 md:right-5 z-20 text-white bg-transparent border-none cursor-pointer focus:outline-none focus-visible:ring-2 focus:ring-clarks-orange focus:ring-offset-2 focus:ring-offset-transparent rounded-full p-1 hover:text-clarks-orange motion-reduce:hidden"
        onClick={toggleMute}
        aria-label={
          muted
            ? isFrench
              ? "Activer le son de la vidéo"
              : "Unmute background video"
            : isFrench
            ? "Couper le son de la vidéo"
            : "Mute background video"
        }
      >
        {muted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
      </button>

      <button
        className="absolute top-5 left-5 md:top-auto md:left-auto md:bottom-5 md:right-16 z-20 text-white bg-transparent border-none cursor-pointer focus:outline-none focus-visible:ring-2 focus:ring-clarks-orange focus:ring-offset-2 focus:ring-offset-transparent rounded-full p-1 hover:text-clarks-orange motion-reduce:hidden"
        onClick={togglePlay}
        aria-label={
          play
            ? isFrench
              ? "Mettre en pause la vidéo"
              : "Pause background video"
            : isFrench
            ? "Reprendre la vidéo"
            : "Play background video"
        }
      >
        {play ? <FaPause size={24} /> : <FaPlay size={24} />}
      </button>
    </>
  );
}
