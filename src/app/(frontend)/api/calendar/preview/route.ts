import { NextResponse, type NextRequest } from "next/server";
import { findDoors, getPublicState, parseLocale } from "@/lib/calendar/doors";
import { isMember } from "@/lib/calendar/member";

const noStore = { "Cache-Control": "no-store" };

/** All 24 doors, for signed-in band members only. */
export async function GET(request: NextRequest) {
  if (!(await isMember(request.headers))) {
    return new NextResponse(null, { status: 403, headers: noStore });
  }
  const { settings, today } = await getPublicState();
  const doors = await findDoors(
    {},
    parseLocale(request.nextUrl.searchParams.get("lang"))
  );
  return NextResponse.json(
    { year: settings.year, today, member: true, doors },
    { headers: noStore }
  );
}
