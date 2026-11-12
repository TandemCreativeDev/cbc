import type { TextFieldSingleValidation } from "payload";
import { embedHosts, parseHttpsUrl, type EmbedType } from "@/utils/safeUrl";

export const optionalHttpsUrl: TextFieldSingleValidation = (value) => {
  if (!value) return true;
  return parseHttpsUrl(value) ? true : "Must be a link starting with https://";
};

export const embedSrc: TextFieldSingleValidation = (value, { siblingData }) => {
  if (!value) return "Required";
  const url = parseHttpsUrl(value);
  if (!url) return "Must be a link starting with https://";
  const type = (siblingData as { type?: EmbedType }).type;
  const hosts: readonly string[] = type
    ? embedHosts[type]
    : Object.values(embedHosts).flat();
  return hosts.includes(url.hostname)
    ? true
    : `Must be on ${hosts.join(" or ")}`;
};
