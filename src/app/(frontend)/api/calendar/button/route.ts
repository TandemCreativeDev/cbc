import { NextResponse, type NextRequest } from "next/server";
import { isMember } from "@/lib/calendar/member";
import { getCalendarSettings } from "@/lib/calendar/settings";

/** Whether the home page shows the calendar button before 1 December: signed-in members only, when the admin allows it. */
export async function GET(request: NextRequest) {
  const show =
    (await isMember(request.headers)) &&
    (await getCalendarSettings()).previewButton;
  return NextResponse.json({ show }, { headers: { "Cache-Control": "no-store" } });
}
