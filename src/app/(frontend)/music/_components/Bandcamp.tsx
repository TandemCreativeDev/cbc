import { IFrameProps } from "@/utils/types";
import { safeEmbedSrc, safeHttpsUrl } from "@/utils/safeUrl";

export default function Bandcamp({ src, href, title }: IFrameProps) {
  const safeSrc = safeEmbedSrc(src, "bandcamp");
  if (!safeSrc) return null;

  return (
    <iframe
      src={safeSrc}
      seamless
      loading="lazy"
      width="1000"
      height="120"
      className="w-full h-full rounded-lg"
      title={`Bandcamp player for ${title}`}
    >
      <a href={safeHttpsUrl(href)}>{title}</a>
    </iframe>
  );
}
