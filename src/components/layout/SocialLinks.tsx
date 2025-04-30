import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaSpotify,
  FaSoundcloud,
  FaTiktok,
  FaYoutube,
  FaAmazon,
  FaApple,
} from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

interface SocialLink {
  icon: React.ComponentType<{ className: string }>;
  url: string;
  label: string;
}

export const socialLinks: SocialLink[] = [
  {
    icon: FaFacebookF,
    url: "https://facebook.com/clarksbowlingclub",
    label: "Facebook",
  },
  {
    icon: FaInstagram,
    url: "https://instagram.com/clarksbowlingclub",
    label: "Instagram",
  },
  {
    icon: FaSpotify,
    url: "https://open.spotify.com/artist/4K3IjWGpwXYwjyNONZwvMZ",
    label: "Spotify",
  },
  {
    icon: FaSoundcloud,
    url: "https://soundcloud.com/clarksbowlingclub",
    label: "Soundcloud",
  },
  {
    icon: FaTiktok,
    url: "https://tiktok.com/@clarksbowlingclub",
    label: "TikTok",
  },
  {
    icon: FaYoutube,
    url: "https://youtube.com/@clarksbowlingclub",
    label: "YouTube",
  },
  {
    icon: FaAmazon,
    url: "https://music.amazon.com/artists/B073M72RKM/clark's-bowling-club",
    label: "Amazon Music",
  },
  {
    icon: FaApple,
    url: "https://music.apple.com/us/artist/clarks-bowling-club/1254533543",
    label: "Apple Music",
  },
];

interface SocialLinksProps {
  className?: string;
}

export default function SocialLinks({ className }: SocialLinksProps) {
  return (
    <ul className={twMerge("flex flex-wrap justify-center gap-5", className)}>
      {socialLinks.map((link, index) => (
        <li key={index} className="hover:text-clarks-orange">
          <Link
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            role="link"
            className="flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-clarks-orange focus:ring-offset-2 focus:ring-offset-transparent motion-safe:transition-colors"
          >
            <link.icon className="h-6 w-6 md:h-5 md:w-5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
