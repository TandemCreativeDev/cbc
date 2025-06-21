import { IFrameProps } from "@/utils/types";

export default function Spotify({ src, title }: IFrameProps) {
  return (
    <div className="aspect-video">
      <iframe
        src={src}
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
