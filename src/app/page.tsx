"use client";

import { useRef, useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import Image from "next/image";

// import hologramNoLight from "../assets/hologram/hologram_nolight.png";
// import hologramLight1 from "../assets/hologram/hologram_light1.png";
// import hologramLight2 from "../assets/hologram/hologram_light2.png";
// import hologramLight3 from "../assets/hologram/hologram_light3.png";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setMuted(videoRef.current.muted);
    }
  };

  return (
    <>
      {/* Background video container */}
      <div className="fixed inset-0 -z-10">
        <video
          ref={videoRef}
          className="absolute inset-0 top-0 left-0 min-h-full w-auto object-cover"
          src="/videos/teaser.mp4"
          autoPlay
          loop
          muted={muted}
        />
      </div>

      {/* Hologram */}
      <div className="absolute top-[calc(50vh-12rem)] left-[calc(50vw-19.2rem)] -translate-x-1/2 -translate-y-1/2 h-96 w-[38.4rem] z-10 transform-style-3d hidden md:block animate-spin-pulse">
        <Image
          src="/hologram/hologram_nolight.png"
          alt="Hologram Base"
          width={500}
          height={500}
          className="absolute top-0 left-0 h-full w-auto object-contain"
          onError={(e) => console.error("Failed to load image:", e)}
        />
        <Image
          src="/hologram/hologram_light1.png"
          alt="Hologram Light 1"
          width={500}
          height={500}
          className="absolute top-0 left-0 h-full w-auto object-contain animate-flicker-1"
          onError={(e) => console.error("Failed to load image:", e)}
        />
        <Image
          src="/hologram/hologram_light2.png"
          alt="Hologram Light 2"
          width={500}
          height={500}
          className="absolute top-0 left-0 h-full w-auto object-contain animate-flicker-2"
          onError={(e) => console.error("Failed to load image:", e)}
        />
        <Image
          src="/hologram/hologram_light3.png"
          alt="Hologram Light 3"
          width={500}
          height={500}
          className="absolute top-0 left-0 h-full w-auto object-contain animate-flicker-3"
          onError={(e) => console.error("Failed to load image:", e)}
        />
      </div>

      {/* Mute button */}
      <button
        className="fixed top-5 left-5 md:top-auto md:left-auto md:bottom-5 md:right-5 z-20 text-white bg-transparent border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-clarks-orange focus:ring-offset-2 focus:ring-offset-transparent rounded-full p-1 hover:text-clarks-orange"
        onClick={toggleMute}
      >
        {muted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
      </button>
    </>
  );
}
