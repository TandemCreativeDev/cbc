import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import SocialLinks from "./SocialLinks";

interface MenuRoute {
  path: string;
  textEN: string;
  textFR: string;
}

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isMenuOpen: boolean) => void;
  menuButtonRef: React.RefObject<HTMLButtonElement>;
}

const menuRoutes: MenuRoute[] = [
  { path: "/", textEN: "Home", textFR: "Accueil" },
  { path: "/about", textEN: "About", textFR: "Bio" },
  { path: "/tour", textEN: "Tour", textFR: "Tournée" },
  { path: "/music", textEN: "Music", textFR: "Musique" },
  { path: "/lyrics", textEN: "Lyrics", textFR: "Paroles" },
  { path: "/contact", textEN: "Contact", textFR: "Contact" },
];

export default function Navbar({
  isMenuOpen,
  setIsMenuOpen,
  menuButtonRef,
}: NavbarProps) {
  const { isFrench } = useLanguage();
  const pathname = usePathname();
  const [activeRouteIndex, setActiveRouteIndex] = useState(-1);
  const [previousRouteIndex, setPreviousRouteIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ballVisible, setBallVisible] = useState(false);
  const navItemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const navRef = useRef<HTMLUListElement>(null);

  const isLanguageChange = useRef(false);
  const currentPosition = useRef({ x: 0 });

  // Find the center position of an active menu item
  const getItemCenterPosition = (index: number) => {
    if (index < 0 || !navItemRefs.current[index] || !navRef.current) return 0;

    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = navItemRefs.current[index].getBoundingClientRect();

    return itemRect.left - navRect.left + itemRect.width / 2 - 12;
  };

  // Handle initial positioning and updates for route changes
  useEffect(() => {
    const index = menuRoutes.findIndex((route) => route.path === pathname);

    if (index !== -1) {
      if (activeRouteIndex === -1) {
        setActiveRouteIndex(index);
        setBallVisible(false);
        setTimeout(() => {
          currentPosition.current.x = getItemCenterPosition(index);
          setBallVisible(true);
        }, 100);
      } else if (index !== activeRouteIndex) {
        setPreviousRouteIndex(activeRouteIndex);
        setActiveRouteIndex(index);
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setIsAnimating(true);
        } else {
          setTimeout(() => {
            currentPosition.current.x = getItemCenterPosition(index);
            forceUpdate();
          }, 50);
        }
      }
    }
  }, [pathname, activeRouteIndex]);

  // Update position when language changes
  useLayoutEffect(() => {
    if (activeRouteIndex === -1) return;
    isLanguageChange.current = true;
    setBallVisible(false);

    // Update position after a short delay to ensure DOM has updated
    const timer = setTimeout(() => {
      const newPos = getItemCenterPosition(activeRouteIndex);
      currentPosition.current.x = newPos;
      forceUpdate();
      setBallVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [activeRouteIndex, isFrench]);

  const [, setForceUpdate] = useState({});
  const forceUpdate = () => setForceUpdate({});

  // Calculate styles for animation
  const getBallStyles = () => {
    if (activeRouteIndex === -1) return {};

    if (
      isAnimating &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const prevPos = getItemCenterPosition(previousRouteIndex);
      const nextPos = getItemCenterPosition(activeRouteIndex);

      return {
        "--prev-position": `${prevPos}px`,
        "--next-position": `${nextPos}px`,
        opacity: ballVisible ? 1 : 0,
        transition: "opacity 0.15s ease-in-out",
      } as React.CSSProperties;
    }

    return {
      transform: `translateX(${currentPosition.current.x}px)`,
      opacity: ballVisible ? 1 : 0,
      transition: "opacity 0.1s ease-in-out",
    };
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
    currentPosition.current.x = getItemCenterPosition(activeRouteIndex);
    setPreviousRouteIndex(-1);
    forceUpdate();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="md:relative">
      {/* Hamburger button (visible on small screens) */}
      <div className="md:hidden absolute right-6 top-5">
        <button
          ref={menuButtonRef}
          onClick={toggleMenu}
          className={clsx(
            "text-white rounded-md p-1",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-clarks-orange",
            "focus:ring-offset-2 focus:ring-offset-transparent"
          )}
          aria-label="Toggle Menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <div className="relative">
        {/* Desktop navigation menu */}
        <ul
          ref={navRef}
          className="hidden md:flex md:h-full md:justify-between md:gap-[2vw] lg:gap-[8vw] md:static"
        >
          {menuRoutes.map((route, index) => (
            <li
              key={`desktop-${route.path}`}
              className="p-0 text-2xl relative"
              ref={(el) => {
                navItemRefs.current[index] = el;
              }}
            >
              <Link
                href={route.path}
                className={clsx(
                  "hover:text-clarks-orange font-blanch text-center px-4 py-2",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-clarks-orange",
                  "focus:ring-offset-2 focus:ring-offset-transparent transition-colors",
                  pathname === route.path && "text-clarks-orange"
                )}
              >
                {isFrench ? route.textFR : route.textEN}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu */}
        <div className={clsx("md:hidden", isMenuOpen ? "block" : "hidden")}>
          <div className="flex flex-col items-center justify-start h-screen w-screen">
            {/* Mobile navigation links */}
            <ul className="flex flex-col items-center my-12 gap-2">
              {menuRoutes.map((route) => (
                <li key={`mobile-${route.path}`} className="p-2 text-6xl">
                  <Link
                    href={route.path}
                    className={clsx(
                      "hover:text-clarks-orange font-blanch text-center px-4 py-2",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-clarks-orange",
                      "focus:ring-offset-2 focus:ring-offset-transparent transition-colors",
                      pathname === route.path && "text-clarks-orange"
                    )}
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    {isFrench ? route.textFR : route.textEN}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social links for mobile only */}
            <div>
              <SocialLinks />
            </div>
          </div>
        </div>

        {/* Bowling ball indicator (desktop only) */}
        {activeRouteIndex !== -1 && (
          <div
            className={clsx(
              "hidden md:block absolute left-1 bottom-[30px] w-4 h-4",
              isAnimating &&
                !window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "animate-bowling-roll"
                : ""
            )}
            style={getBallStyles()}
            onAnimationEnd={handleAnimationEnd}
          >
            <Image
              src="/svg/bowling-ball-toggle.svg"
              alt="Active page indicator"
              width={24}
              height={24}
              className={clsx(
                isAnimating &&
                  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "animate-bowling-spin"
                  : ""
              )}
            />
          </div>
        )}
      </div>
    </nav>
  );
}
