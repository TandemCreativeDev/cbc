export interface IFrameProps {
  src: string;
  title: string;
}

export default function IFrame({ src, title }: IFrameProps) {
  return (
    <div className="aspect-video">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full rounded-lg"
      />
    </div>
  );
}
