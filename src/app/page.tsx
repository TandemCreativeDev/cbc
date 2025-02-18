"use client";

import { useRef, useState } from "react";
import { FaVolumeMute, FaVolumeUp, FaPause, FaPlay } from "react-icons/fa";
import SpinningLogo from "@/components/Home/SpinningLogo";
import Image from "next/image";
import StaticLogo from "@/components/Home/StaticLogo";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [play, setPlay] = useState(true);

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
      {/* Background video container */}
      <div className="fixed inset-0 -z-10">
        <video
          ref={videoRef}
          className={`${backgroundClasses} motion-reduce:hidden`}
          src="/videos/teaser.mp4"
          autoPlay
          loop
          muted={muted}
        />
        <Image
          src="/images/home.png"
          alt=""
          fill
          className={`${backgroundClasses} motion-reduce:block hidden`}
        />
      </div>
      {/* Hologram */}
      <SpinningLogo />
      <StaticLogo />
      {/* Mute button */}
      <button
        className="absolute top-5 left-16 md:top-auto md:left-auto md:bottom-5 md:right-5 z-20 text-white bg-transparent border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-clarks-orange focus:ring-offset-2 focus:ring-offset-transparent rounded-full p-1 hover:text-clarks-orange motion-reduce:hidden"
        onClick={toggleMute}
      >
        {muted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
      </button>
      {/* Play button */}
      <button
        className="absolute top-5 left-5 md:top-auto md:left-auto md:bottom-5 md:right-16 z-20 text-white bg-transparent border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-clarks-orange focus:ring-offset-2 focus:ring-offset-transparent rounded-full p-1 hover:text-clarks-orange motion-reduce:hidden"
        onClick={togglePlay}
      >
        {play ? <FaPause size={24} /> : <FaPlay size={24} />}
      </button>
    </>
  );
}
