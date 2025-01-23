"use client";

import { useRef, useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import SpinningLogo from "@/components/Home/SpinningLogo";
import SpinningRing from "@/components/Home/SpinningRing";

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
      <SpinningRing />
      <SpinningLogo />

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
