import { TourDateType } from "./types";

export default function gigTime(gig: TourDateType): number {
  const [day, month, year] = gig.eventDate.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
}
