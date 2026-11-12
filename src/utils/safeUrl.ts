export const embedHosts = {
  youtube: ["www.youtube.com", "www.youtube-nocookie.com"],
  spotify: ["open.spotify.com"],
  bandcamp: ["bandcamp.com"],
} as const;

export type EmbedType = keyof typeof embedHosts;

export const parseHttpsUrl = (value: string): URL | null => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
};

export const safeHttpsUrl = (value?: string): string | undefined =>
  value && parseHttpsUrl(value) ? value : undefined;

export const safeEmbedSrc = (
  value: string | undefined,
  type: EmbedType
): string | undefined => {
  const url = value ? parseHttpsUrl(value) : null;
  const hosts: readonly string[] = embedHosts[type];
  return url && hosts.includes(url.hostname) ? value : undefined;
};
