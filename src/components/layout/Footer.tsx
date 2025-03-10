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

interface SocialLink {
  icon: React.ComponentType<{ className: string }>;
  url: string;
  label: string;
}

const socialLinks: SocialLink[] = [
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

export default function Footer() {
  return (
    <footer className="bg-transparent flex flex-col justify-center align-bottom">
      <ul className="flex flex-wrap justify-center gap-1 align-bottom">
        {socialLinks.map((link, index) => (
          <li key={index} className="hover:text-clarks-orange">
            <Link
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              role="link"
              className="flex items-center justify-center p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-clarks-orange focus:ring-offset-2 focus:ring-offset-transparent transition-colors"
            >
              <link.icon className="h-5 w-5" />
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-row gap-2 justify-center p-2">
        <p>&copy; 2025</p>
        <Link
          href="https://runintandem.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-clarks-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-clarks-orange focus:ring-offset-2 focus:ring-offset-transparent transition-colors"
          aria-label="Visit the Tandem Creative Dev website"
          role="link"
        >
          Tandem Creative Dev
        </Link>
      </div>
    </footer>
  );
}
