import { IFrameProps } from "@/utils/types";
import { safeEmbedSrc } from "@/utils/safeUrl";

export default function Spotify({ src, title }: IFrameProps) {
  const safeSrc = safeEmbedSrc(src, "spotify");
  if (!safeSrc) return null;

  return (
    <div className="aspect-video">
      <iframe
        src={safeSrc}
        title={title}
        width="1000"
        height="352"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="w-full h-full rounded-lg"
      />
    </div>
  );
}
