import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const storageEndpoint = process.env.S3_ENDPOINT;

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: storageEndpoint ? [new URL(`${storageEndpoint}/**`)] : [],
  },
};

export default withPayload(nextConfig);
