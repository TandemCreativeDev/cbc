import { IFrameProps } from "../../utils/types";

export default function Youtube({ src, title }: IFrameProps) {
  return (
    <iframe
      src={src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      className="aspect-video w-full h-full rounded-lg"
    />
  );
}
