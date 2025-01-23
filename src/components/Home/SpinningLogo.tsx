import Image from "next/image";

export default function SpinningLogo() {
  return (
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
  );
}
