import Link from "next/link";
import { TourDateType } from "../../utils/types";

interface TourDateProps {
  tourDate: TourDateType;
  pastOrFuture: string;
}

export default function TourDate({ tourDate, pastOrFuture }: TourDateProps) {
  const { eventDate, venue, location, locationUrl, ticketUrl } = tourDate;

  const formattedDate = new Date(
    eventDate.split("/").reverse().join("-")
  ).toLocaleDateString("en-GB", {
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
        <span className="md:w-1/6 mt-4 md:mt-0">
          {pastOrFuture === "upcoming events" ? (
            ticketUrl ? (
              <Link
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Buy tickets for ${venue}`}
                role="link"
                className="bg-white text-black text-center p-3 hover:bg-gray-300"
              >
                Buy Tickets
              </Link>
            ) : (
              <span className="bg-gray-800 text-gray-400 text-center p-3 cursor-not-allowed">
                Unavailable
              </span>
            )
          ) : (
            <span className="bg-gray-800 text-gray-400 text-center p-3 cursor-not-allowed">
              Unavailable
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
