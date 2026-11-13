import { createLocalReq, getPayload } from "payload";
import type { NextRequest } from "next/server";
import config from "@/payload.config";
import { calendarDays } from "@/lib/calendar/defaults";
import { getPublicState } from "@/lib/calendar/doors";
import { isMember } from "@/lib/calendar/member";

const privateHeaders = { "Cache-Control": "private, no-cache" };

const refuse = (status: number) =>
  new Response(null, { status, headers: privateHeaders });

/**
 * Streams a demo from the private bucket through Payload's own file handler,
 * so range requests (seeking) work. The day is checked on every request.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ day: string }> }
) {
  const day = Number((await params).day);
  if (!Number.isInteger(day) || day < 1 || day > calendarDays) return refuse(404);

  if (!(await isMember(request.headers))) {
    const { open, today } = await getPublicState();
    if (!open) return refuse(404);
    if (day > today) return refuse(403);
  }

  const payload = await getPayload({ config });
  const {
    docs: [door],
  } = await payload.find({
    collection: "calendar-doors",
    where: { day: { equals: day } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  if (!door?.filename) return refuse(404);

  const collection = payload.collections["calendar-doors"].config;
  const handler = collection.upload.handlers?.at(-1);
  if (!handler) return refuse(404);

  const req = Object.assign(await createLocalReq({}, payload), {
    headers: request.headers,
    signal: request.signal,
  });
  const file = await handler(req, {
    doc: door,
    params: { collection: collection.slug, filename: door.filename },
  });
  if (!file) return refuse(404);

  const headers = new Headers(file.headers);
  headers.set("Cache-Control", privateHeaders["Cache-Control"]);
  headers.set("Accept-Ranges", "bytes");
  if (request.nextUrl.searchParams.has("download")) {
    headers.set(
      "Content-Disposition",
      `attachment; filename="${String(day).padStart(2, "0")}.mp3"`
    );
  }
  return new Response(file.body, { status: file.status, headers });
}
