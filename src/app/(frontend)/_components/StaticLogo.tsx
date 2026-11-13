import Image from "next/image";

export default function StaticLogo() {
  const imgUrls = [
    "/hologram/hologram_light1.webp",
    "/hologram/hologram_light2.webp",
    "/hologram/hologram_light3.webp",
    "/hologram/hologram_nolight.webp",
  ];

  return (
    <>
      {imgUrls.map((imgUrl) => (
        <Image
          key={imgUrl}
          src={imgUrl}
          alt=""
          width={500}
          height={200}
          className="absolute top-0 translate-y-1/4 left-1/2 -translate-x-1/2 md:motion-reduce:block hidden"
          role="presentation"
        />
      ))}
    </>
  );
}
