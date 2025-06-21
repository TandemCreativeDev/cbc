import { TourDateType } from "../../utils/types";
import TourDate from "./TourDate";

interface TourDatesContainerProps {
  tourDates: TourDateType[];
  title: string;
}

export default function TourDatesContainer({
  tourDates,
  title,
}: TourDatesContainerProps) {
  // Create ID-safe version of title
  const sectionId = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const headingId = `${sectionId}-heading`;

  return (
    <section id={sectionId} aria-labelledby={headingId} className="mb-10">
      <h2 id={headingId} className="text-3xl pb-10 font-blanch">
        {title}
      </h2>
      <ul className="space-y-6">
        {tourDates.map((tourDate) => (
          <TourDate
            key={tourDate.eventDate + tourDate.venue}
            tourDate={tourDate}
            inPast={title === "past events" || title === "dates passées"}
          />
        ))}
      </ul>
    </section>
  );
}
