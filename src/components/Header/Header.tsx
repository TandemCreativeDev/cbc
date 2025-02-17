"use client";

import Navbar from "./Navbar";
import Toggle from "./Toggle";
import Link from "next/link";
// import bowlingBall from "../../assets/bowling-ball-toggle.svg";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // This prevents the user scrolling when the menu is open which I think works great
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  return (
    <header className="absolute top-0 left-0 w-full md:bg-black md:bg-opacity-10 md:text-white z-20 md:motion-reduce:bg-opacity-30">
      <div
        className={isMenuOpen ? `backdrop-blur-sm h-screen w-screen` : `null`}
      >
        <div className="flex flex-col gap-2 md:flex-row items-center p-4 md:justify-between">
          <Link
            href="/"
            className="flex flex-col items-center text-center md:items-start md:text-left group"
          >
            <p className="font-damion mb-0 text-3xl transition-colors group-hover:text-clarks-orange">
              Clark&apos;s
            </p>
            <p className="font-blanch mt-[-0.75rem] text-2xl relative flex items-center justify-center">
              <span className="transition-transform duration-300 group-hover:translate-x-[-3px] ">
                BOWLING
              </span>
              <span className="relative w-[10px] h-[10px]">
                <Image
                  src="/svg/bowling-ball-toggle.svg"
                  alt="Clark's bowling ball"
                  className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  height={500}
                  width={500}
                />
              </span>
              <span className="transition-transform duration-300 group-hover:translate-x-[3px] ">
                CLUB
              </span>
            </p>
          </Link>
          <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          <Toggle />
        </div>
      </div>
    </header>
  );
}
