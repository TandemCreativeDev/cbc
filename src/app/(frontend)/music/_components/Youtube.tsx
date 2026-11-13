import { IFrameProps } from "@/utils/types";
import { safeEmbedSrc } from "@/utils/safeUrl";

export default function Youtube({ src, title }: IFrameProps) {
  const safeSrc = safeEmbedSrc(src, "youtube");
  if (!safeSrc) return null;

  return (
    <iframe
      src={safeSrc}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="aspect-video w-full h-full rounded-lg"
    />
  );
}
