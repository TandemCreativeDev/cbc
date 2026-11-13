import { NextResponse, type NextRequest } from "next/server";
import { findDoors, getPublicState, parseLocale } from "@/lib/calendar/doors";
import { isMember } from "@/lib/calendar/member";

const noStore = { "Cache-Control": "no-store" };

/** The doors open today. Members get an empty list while the calendar is hidden. */
export async function GET(request: NextRequest) {
  const { settings, today, open } = await getPublicState();
  const member = await isMember(request.headers);
  if (!open && !member) {
    return new NextResponse(null, { status: 404, headers: noStore });
  }
  const doors =
    open && today > 0
      ? await findDoors(
          { day: { less_than_equal: today } },
          parseLocale(request.nextUrl.searchParams.get("lang"))
        )
      : [];
  return NextResponse.json(
    { year: settings.year, today, open, member, doors },
    { headers: noStore }
  );
}
