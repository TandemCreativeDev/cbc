import Link from "next/link";
import { TourDateType } from "../../utils/types";

import { useLanguage } from "@/context/LanguageContext";

interface TourDateProps {
  tourDate: TourDateType;
  inPast: boolean;
}

export default function TourDate({ tourDate, inPast }: TourDateProps) {
  const { eventDate, venue, location, locationUrl, ticketUrl } = tourDate;
  const { isFrench } = useLanguage();
  const unavailable = isFrench ? "Indisponible" : "Unavailable";
  const buttonClass = "text-center p-3 w-36";
  const availableClass = "bg-white text-black hover:bg-gray-300";
  const unavailableClass = "bg-gray-800 text-gray-400 cursor-not-allowed";

  const formattedDate = new Date(
    eventDate.split("/").reverse().join("-")
  ).toLocaleDateString(isFrench ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mb-6 border-b-4 border-gray-300 pb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
        <span className="font-bold text-lg md:w-1/4">{formattedDate}</span>
        <Link
          href={locationUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${venue} in ${location} map`}
          role="link"
          className={`font-bold text-clarks-orange text-xl md:w-1/3 ${
            locationUrl
              ? "hover:text-clarks-red"
              : "text-gray-400 pointer-events-none"
          }`}
        >
          {venue}
        </Link>
        <span className="md:w-1/4">{location}</span>
        <div className="md:w-1/6 mt-4 md:mt-0">
          {inPast ? (
            <button className={`${buttonClass} ${unavailableClass}`}>
              {unavailable}
            </button>
          ) : ticketUrl ? (
            <button
              onClick={() =>
                window.open(ticketUrl, "_blank", "noopener,noreferrer")
              }
              aria-label={`Buy tickets for ${venue}`}
              className={`${buttonClass} ${availableClass}`}
            >
              {isFrench ? "Acheter billets" : "Buy Tickets"}
            </button>
          ) : (
            <button className={`${buttonClass} ${unavailableClass}`}>
              {unavailable}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
