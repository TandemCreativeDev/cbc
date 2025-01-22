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
  icon: (props: { className: string }) => JSX.Element;
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
    <footer className="bg-transparent h-[4.5rem] flex flex-col justify-center align-bottom">
      <div className="flex flex-wrap justify-center gap-4 px-4 h-10 align-bottom">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-clarks-orange transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-clarks-orange focus:ring-offset-2 focus:ring-offset-transparent rounded-full p-1"
            aria-label={link.label}
          >
            <link.icon className="w-5 h-5" />
          </a>
        ))}
      </div>
      <div className="flex flex-row gap-2 justify-center p-2">
        <p>&copy; 2024</p>
        <a href="https://viatora.co.uk" className="hover:text-clarks-orange">
          <p>Viatora Digital &nabla;</p>
        </a>
      </div>
    </footer>
  );
}
