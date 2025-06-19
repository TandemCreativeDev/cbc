import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import clsx from "clsx";

interface CarouselProps {
  images: string[];
  altTexts?: string[];
}

export default function Carousel({ images, altTexts }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [announcement, setAnnouncement] = useState(
    `Slide 1 of ${images.length}: ${altTexts?.[0] || "Band image"}`
  );

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const alt = altTexts?.[currentIndex] || `Band image ${currentIndex + 1}`;
    setAnnouncement(`Slide ${currentIndex + 1} of ${images.length}: ${alt}`);
  }, [currentIndex, altTexts, images.length]);

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg">
      {/* Image container */}
      <div
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <Image
            width={5000}
            height={500}
            key={index}
            src={image}
            alt={altTexts?.[index] || `Band image ${index + 1}`}
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 focus:outline-none focus-visible:ring-2 focus:ring-clarks-orange"
        aria-label="Previous slide"
      >
        <FaChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-clarks-orange"
        aria-label="Next photo"
        role="button"
      >
        <FaChevronRight size={24} />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={clsx(
              "w-2 h-2 m-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus:ring-clarks-orange",
              index === currentIndex ? "bg-clarks-orange" : "bg-white/50"
            )}
            aria-label={`Go to photo ${index + 1}`}
            role="button"
          />
        ))}
      </div>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
