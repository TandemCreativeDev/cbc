import { getPayload } from "payload";
import config from "@/payload.config";

const notFound = () =>
  new Response(null, { status: 404, headers: { "Cache-Control": "private, no-cache" } });

/** The opening sound from public storage, served from the site's own origin so the page's CSP allows fetching it. */
export async function GET() {
  const payload = await getPayload({ config });
  const { openingSound } = await payload.findGlobal({
    slug: "calendar-settings",
    depth: 1,
  });
  const url = typeof openingSound === "object" ? openingSound?.url : null;
  const file = url ? await fetch(url).catch(() => null) : null;
  if (!file?.ok) return notFound();
  return new Response(file.body, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
