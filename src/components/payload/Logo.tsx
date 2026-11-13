import Image from "next/image";

export const Logo = () => (
  <div className="clarks-logo">
    <Image
      src="/svg/favicon.svg"
      alt=""
      width={64}
      height={64}
      unoptimized
      preload
    />
    <span className="clarks-logo__name">Clark&rsquo;s Bowling Club</span>
  </div>
);
