import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import sharp from "sharp";
import { CalendarDoors } from "./collections/CalendarDoors";
import { Lyrics } from "./collections/Lyrics";
import { Media } from "./collections/Media";
import { MusicItems } from "./collections/MusicItems";
import { TourDates } from "./collections/TourDates";
import { Users } from "./collections/Users";
import { CalendarSettings } from "./globals/CalendarSettings";
import { AboutPage, TourPage } from "./globals/pageCopy";
import { demosStoragePlugin, storagePlugin } from "./lib/payload/storage";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " - Clark's Bowling Club",
      icons: [{ rel: "icon", url: "/favicon.ico" }],
    },
    components: {
      graphics: {
        Logo: "/components/payload/Logo#Logo",
        Icon: "/components/payload/Icon#Icon",
      },
      beforeDashboard: [
        "/components/payload/DashboardWelcome#DashboardWelcome",
      ],
    },
    importMap: {
      baseDir: dirname,
    },
  },
  collections: [Users, Media, TourDates, MusicItems, Lyrics, CalendarDoors],
  globals: [AboutPage, TourPage, CalendarSettings],
  localization: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    fallback: true,
  },
  graphQL: { disable: true },
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  sharp,
  plugins: [storagePlugin, demosStoragePlugin],
});
