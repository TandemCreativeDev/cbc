import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";

export interface MenuRoute {
  path: string;
  textEN: string;
  textFR: string;
}

interface UseNavAnimationProps {
  pathname: string;
  menuRoutes: MenuRoute[];
  isFrench: boolean;
  navRef: React.RefObject<HTMLUListElement | null>;
  navItemRefs: React.RefObject<Array<HTMLLIElement | null>>;
}

interface UseNavAnimationReturn {
  activeRouteIndex: number;
  previousRouteIndex: number;
  isAnimating: boolean;
  ballVisible: boolean;
  currentPosition: React.RefObject<{ x: number }>;
  getBallStyles: () => React.CSSProperties;
  handleAnimationEnd: () => void;
}

export function useNavAnimation({
  pathname,
  menuRoutes,
  isFrench,
  navRef,
  navItemRefs,
}: UseNavAnimationProps): UseNavAnimationReturn {
  const [activeRouteIndex, setActiveRouteIndex] = useState(-1);
  const [previousRouteIndex, setPreviousRouteIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ballVisible, setBallVisible] = useState(false);

  const isLanguageChange = useRef(false);
  const currentPosition = useRef({ x: 0 });

  const [, setForceUpdate] = useState({});
  const forceUpdate = () => setForceUpdate({});

  // Find the center position of an active menu item
  const getItemCenterPosition = useCallback(
    (index: number) => {
      if (
        index < 0 ||
        !navItemRefs.current[index] ||
        !navRef ||
        !navRef.current
      )
        return 0;

      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = navItemRefs.current[index].getBoundingClientRect();

      return itemRect.left - navRect.left + itemRect.width / 2 - 12;
    },
    [navRef, navItemRefs]
  );

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
  }, [pathname, activeRouteIndex, menuRoutes, getItemCenterPosition]);

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
  }, [activeRouteIndex, getItemCenterPosition, isFrench]);

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

  return {
    activeRouteIndex,
    previousRouteIndex,
    isAnimating,
    ballVisible,
    currentPosition,
    getBallStyles,
    handleAnimationEnd,
  };
}
