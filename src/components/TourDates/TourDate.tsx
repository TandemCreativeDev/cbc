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
        <a
          href={locationUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-bold text-clarks-orange text-xl md:w-1/3 ${
            locationUrl
              ? "hover:text-clarks-red"
              : "text-gray-400 pointer-events-none"
          }`}
        >
          {venue}
        </a>
        <span className="md:w-1/4">{location}</span>
        <span className="md:w-1/6 mt-4 md:mt-0">
          {pastOrFuture === "upcoming events" ? (
            ticketUrl ? (
              <a
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black text-center p-3 hover:bg-gray-300"
              >
                Buy Tickets
              </a>
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
