import type { TextFieldSingleValidation } from "payload";

const httpsUrl = (value: string): URL | null => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
};

export const optionalHttpsUrl: TextFieldSingleValidation = (value) => {
  if (!value) return true;
  return httpsUrl(value) ? true : "Must be a link starting with https://";
};

const embedHosts = {
  youtube: ["www.youtube.com", "www.youtube-nocookie.com"],
  spotify: ["open.spotify.com"],
  bandcamp: ["bandcamp.com"],
} as const;

type EmbedType = keyof typeof embedHosts;

export const embedSrc: TextFieldSingleValidation = (value, { siblingData }) => {
  if (!value) return "Required";
  const url = httpsUrl(value);
  if (!url) return "Must be a link starting with https://";
  const type = (siblingData as { type?: EmbedType }).type;
  const hosts: readonly string[] = type
    ? embedHosts[type]
    : Object.values(embedHosts).flat();
  return hosts.includes(url.hostname)
    ? true
    : `Must be on ${hosts.join(" or ")}`;
};
