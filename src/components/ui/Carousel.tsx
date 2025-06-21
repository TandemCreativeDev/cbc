import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import clsx from "clsx";

interface CarouselProps {
  images: string[];
  altTexts?: string[];
  caption?: string;
}

export default function Carousel({ images, altTexts, caption }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  const nextSlide = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setAnnouncement(
      `Image ${newIndex + 1} of ${images.length}: ${
        altTexts?.[newIndex] || `Image ${newIndex + 1}`
      }`
    );
  };

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setAnnouncement(
      `Image ${newIndex + 1} of ${images.length}: ${
        altTexts?.[newIndex] || `Image ${newIndex + 1}`
      }`
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAnnouncement(
      `Image ${index + 1} of ${images.length}: ${
        altTexts?.[index] || `Image ${index + 1}`
      }`
    );
  };

  useEffect(() => {
    const alt = altTexts?.[currentIndex] || `Image ${currentIndex + 1}`;
    setAnnouncement(`Image ${currentIndex + 1} of ${images.length}: ${alt}`);
  }, [currentIndex, altTexts, images.length]);

  return (
    <figure className="relative w-full h-96 overflow-hidden rounded-lg">
      {/* Images container */}
      <ul
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        role="group"
        aria-label={`Image carousel with ${images.length} images`}
      >
        {images.map((image, index) => (
          <li key={index} className="w-full h-full flex-shrink-0">
            <Image
              width={5000}
              height={500}
              src={image}
              alt={altTexts?.[index] || `Band image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </li>
        ))}
      </ul>

      {/* Navigation controls */}
      <nav
        aria-label="Carousel navigation"
        className="absolute inset-0 flex items-center justify-between pointer-events-none"
      >
        <button
          onClick={prevSlide}
          className="ml-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 focus:outline-none focus-visible:ring-2 focus:ring-clarks-orange pointer-events-auto"
          aria-label={`Previous image, currently showing image ${
            currentIndex + 1
          } of ${images.length}`}
        >
          <FaChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          className="mr-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 focus:outline-none focus-visible:ring-2 focus:ring-clarks-orange pointer-events-auto"
          aria-label={`Next image, currently showing image ${
            currentIndex + 1
          } of ${images.length}`}
        >
          <FaChevronRight size={24} />
        </button>
      </nav>

      {/* Slide indicators */}
      <nav
        aria-label="Slide indicators"
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
      >
        <ol className="flex">
          {images.map((_, index) => (
            <li key={index}>
              <button
                onClick={() => goToSlide(index)}
                className={clsx(
                  "w-2 h-2 m-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus:ring-clarks-orange",
                  index === currentIndex ? "bg-clarks-orange" : "bg-white/50"
                )}
                aria-label={`Go to image ${index + 1}${
                  altTexts?.[index] ? `: ${altTexts[index]}` : ""
                }`}
                aria-current={index === currentIndex ? "true" : "false"}
              />
            </li>
          ))}
        </ol>
      </nav>

      {/* Live region for announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Optional caption */}
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
