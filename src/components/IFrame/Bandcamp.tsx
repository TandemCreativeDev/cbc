import { IFrameProps } from "../../utils/types";

export default function Bandcamp({ src, href, title }: IFrameProps) {
  return (
    <iframe
      src={src}
      seamless
      width="1000"
      height="120"
      className="w-full h-full rounded-lg"
    >
      <a href={href}>{title}</a>
    </iframe>
  );
}
