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
  return (
    <div className="mb-10">
      <h3 className="text-3xl pb-10 font-blanch">{title}</h3>
      <div className="flex flex-col">
        {tourDates.map((tourDate) => (
          <TourDate
            key={tourDate.eventDate + tourDate.venue}
            tourDate={tourDate}
            inPast={title === "past events" || title === "dates passées"}
          />
        ))}
      </div>
    </div>
  );
}
