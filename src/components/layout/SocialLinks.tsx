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
import { useLanguage } from "@/context/LanguageContext";

interface SocialLink {
  icon: React.ComponentType<{ className: string }>;
  url: string;
  label: string;
  platformName: string;
}

export const socialLinks: SocialLink[] = [
  {
    icon: FaFacebookF,
    url: "https://facebook.com/clarksbowlingclub",
    label: "Facebook",
    platformName: "Facebook",
  },
  {
    icon: FaInstagram,
    url: "https://instagram.com/clarksbowlingclub",
    label: "Instagram",
    platformName: "Instagram",
  },
  {
    icon: FaSpotify,
    url: "https://open.spotify.com/artist/4K3IjWGpwXYwjyNONZwvMZ",
    label: "Spotify",
    platformName: "Spotify",
  },
  {
    icon: FaSoundcloud,
    url: "https://soundcloud.com/clarksbowlingclub",
    label: "SoundCloud",
    platformName: "SoundCloud",
  },
  {
    icon: FaTiktok,
    url: "https://tiktok.com/@clarksbowlingclub",
    label: "TikTok",
    platformName: "TikTok",
  },
  {
    icon: FaYoutube,
    url: "https://youtube.com/@clarksbowlingclub",
    label: "YouTube",
    platformName: "YouTube",
  },
  {
    icon: FaAmazon,
    url: "https://music.amazon.com/artists/B073M72RKM/clark's-bowling-club",
    label: "Amazon Music",
    platformName: "Amazon Music",
  },
  {
    icon: FaApple,
    url: "https://music.apple.com/us/artist/clarks-bowling-club/1254533543",
    label: "Apple Music",
    platformName: "Apple Music",
  },
];

interface SocialLinksProps {
  className?: string;
}

export default function SocialLinks({ className }: SocialLinksProps) {
  const { isFrench } = useLanguage();

  return (
    <nav aria-label={isFrench ? "Liens sociaux" : "Social media links"}>
      <ul
        className={twMerge("flex flex-wrap justify-center gap-5", className)}
        role="list"
      >
        {socialLinks.map((link, index) => (
          <li key={index} className="hover:text-clarks-orange">
            <Link
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit Clark's Bowling Club on ${link.platformName} (opens in new tab)`}
              className="flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-clarks-orange focus:ring-offset-2 focus:ring-offset-transparent motion-safe:transition-colors"
            >
              <link.icon className="h-6 w-6 md:h-5 md:w-5" aria-hidden="true" />
              <span className="sr-only">{link.platformName}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
