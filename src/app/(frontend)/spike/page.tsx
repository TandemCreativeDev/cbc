import { Suspense } from "react";
import Image from "next/image";
import { connection } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

async function TourDates() {
  await connection();
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "tour-dates",
    sort: "eventDate",
    depth: 1,
  });

  return (
    <ul className="space-y-6">
      {docs.map(({ id, eventDate, venue, location, image }) => (
        <li key={id}>
          <p>
            {new Date(eventDate).toLocaleDateString("en-GB")}: {venue},{" "}
            {location}
          </p>
          {typeof image === "object" && image?.url && (
            <Image
              src={image.url}
              alt={image.alt}
              width={image.width ?? 640}
              height={image.height ?? 480}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function SpikePage() {
  return (
    <>
      <h1 className="text-4xl mb-6 font-blanch">Payload spike</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <TourDates />
      </Suspense>
    </>
  );
}
