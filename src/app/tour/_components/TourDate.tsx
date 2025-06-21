import Link from "next/link";
import { TourDateType } from "../../../utils/types";

import { useLanguage } from "@/context/LanguageContext";
import Button from "../../../components/ui/Button";
import clsx from "clsx";

interface TourDateProps {
  tourDate: TourDateType;
  inPast: boolean;
}

export default function TourDate({ tourDate, inPast }: TourDateProps) {
  const { eventDate, venue, location, locationUrl, ticketUrl } = tourDate;
  const { isFrench } = useLanguage();
  const unavailable = isFrench ? "Indisponible" : "Unavailable";

  const formattedDate = new Date(
    eventDate.split("/").reverse().join("-")
  ).toLocaleDateString(isFrench ? "fr-FR" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <li className="border-b-4 border-gray-300 pb-6">
      <article className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
        <time
          dateTime={eventDate.split("/").reverse().join("-")}
          className="font-bold text-lg md:w-1/4"
        >
          {formattedDate}
        </time>

        <h3 className="md:w-1/3">
          <Link
            href={locationUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${venue} in ${location} map`}
            role="link"
            className={clsx(
              "font-bold text-clarks-orange text-xl focus:outline-none focus-visible:ring-2 focus:ring-clarks-orange focus:ring-offset-2 focus:ring-offset-transparent transition-colors",
              locationUrl
                ? "hover:text-clarks-red"
                : "text-gray-400 pointer-events-none"
            )}
          >
            {venue}
          </Link>
        </h3>

        <address className="md:w-1/4 not-italic">{location}</address>

        <div className="md:w-1/6">
          {inPast ? (
            <Button label={unavailable} isLink disabled />
          ) : ticketUrl ? (
            <Button
              onClick={() =>
                window.open(ticketUrl, "_blank", "noopener,noreferrer")
              }
              aria-label={`Buy tickets for ${venue}`}
              isLink
              label={isFrench ? "Acheter billets" : "Buy Tickets"}
            />
          ) : (
            <Button label={unavailable} isLink disabled />
          )}
        </div>
      </article>
    </li>
  );
}
