import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security/headers";

const storageEndpoint = process.env.S3_ENDPOINT;

const nextConfig: NextConfig = {
  cacheComponents: true,
  poweredByHeader: false,
  headers: async () => securityHeaders,
  images: {
    remotePatterns: storageEndpoint ? [new URL(`${storageEndpoint}/**`)] : [],
  },
  // Without a database the admin and Payload API stay hidden, as before Payload.
  async rewrites() {
    if (process.env.DATABASE_URL) return [];
    return {
      beforeFiles: [
        { source: "/admin/:path*", destination: "/nope" },
        { source: "/calendrier", destination: "/nope" },
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

const payloadConfig = withPayload(nextConfig);
const payloadHeaders = payloadConfig.headers;

// Payload asks every page for the Sec-CH-Prefers-Color-Scheme hint, and Critical-CH makes
// Chrome repeat a first visit's document request. Only the admin reads the hint.
payloadConfig.headers = async () => {
  const rules = (await payloadHeaders?.()) ?? [];
  const isClientHintRule = (rule: (typeof rules)[number]) =>
    rule.headers.some(({ key }) => key.toLowerCase() === "critical-ch");
  if (!rules.some(isClientHintRule)) {
    throw new Error(
      "withPayload no longer sends Critical-CH: review the admin-only re-scope in next.config.ts",
    );
  }
  return rules.map((rule) =>
    isClientHintRule(rule) ? { ...rule, source: "/admin/:path*" } : rule,
  );
};

export default payloadConfig;
