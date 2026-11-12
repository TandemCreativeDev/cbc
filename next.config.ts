import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const storageEndpoint = process.env.S3_ENDPOINT;

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: storageEndpoint ? [new URL(`${storageEndpoint}/**`)] : [],
  },
  // Without a database the admin and Payload API stay hidden, as before Payload.
  async rewrites() {
    if (process.env.DATABASE_URL) return [];
    return {
      beforeFiles: [
        { source: "/admin/:path*", destination: "/nope" },
        {
          source: "/api/:path((?!send-emails$).*)",
          destination: "/nope",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withPayload(nextConfig);
