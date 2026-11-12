import type { NextConfig } from "next";
import { embedHosts } from "../../utils/safeUrl";

type Directives = Record<string, string[]>;
type HeaderRule = Awaited<
  ReturnType<NonNullable<NextConfig["headers"]>>
>[number];

// Switch to "Content-Security-Policy" to enforce.
const CSP_HEADER = "Content-Security-Policy-Report-Only";

const storage = process.env.S3_ENDPOINT
  ? [new URL(process.env.S3_ENDPOINT).origin]
  : [];
const isDev = process.env.NODE_ENV !== "production";
const embedOrigins = Object.values(embedHosts)
  .flat()
  .map((host) => `https://${host}`);

const baseDirectives: Directives = {
  "default-src": ["'self'"],
  // Next.js inlines its bootstrap scripts, and static pages can't carry a nonce.
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    ...(isDev ? ["'unsafe-eval'"] : []),
  ],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "blob:", ...storage],
  "font-src": ["'self'", "data:"],
  "media-src": ["'self'", ...storage],
  "connect-src": ["'self'"],
  "frame-src": embedOrigins,
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
};

/** Extra allowances for one top-level path; every other path gets the base policy. */
const routePolicies: { path: string; extra: Directives }[] = [
  {
    path: "admin",
    extra: {
      "connect-src": storage,
      "frame-src": ["'self'"],
    },
  },
];

const buildPolicy = (extra: Directives = {}): string =>
  Object.entries(baseDirectives)
    .map(([name, values]) =>
      [name, ...values, ...(extra[name] ?? [])].join(" ")
    )
    .join("; ");

const cspHeader = (extra?: Directives) => ({
  key: CSP_HEADER,
  value: buildPolicy(extra),
});

const scopedPaths = routePolicies.map(({ path }) => `${path}(?:/|$)`);

export const securityHeaders: HeaderRule[] = [
  {
    source: "/:path*",
    headers: [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value:
          "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
      },
    ],
  },
  ...routePolicies.map(({ path, extra }) => ({
    source: `/${path}/:path*`,
    headers: [cspHeader(extra)],
  })),
  {
    source: `/:path((?!${scopedPaths.join("|")}).*)`,
    headers: [cspHeader()],
  },
];
