import { useState, useRef, useLayoutEffect, useCallback } from "react";
import usePrefersReducedMotion from "@/utils/usePrefersReducedMotion";

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
  const routeIndex = menuRoutes.findIndex((route) => route.path === pathname);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [activeRouteIndex, setActiveRouteIndex] = useState(-1);
  const [previousRouteIndex, setPreviousRouteIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ballVisible, setBallVisible] = useState(false);
  const [positionedLanguage, setPositionedLanguage] = useState(isFrench);

  const currentPosition = useRef({ x: 0 });

  const [, setForceUpdate] = useState({});
  const forceUpdate = () => setForceUpdate({});

  if (routeIndex !== -1 && routeIndex !== activeRouteIndex) {
    setPreviousRouteIndex(activeRouteIndex);
    setActiveRouteIndex(routeIndex);
    setIsAnimating(activeRouteIndex !== -1 && !prefersReducedMotion);
    setBallVisible(false);
  }

  if (positionedLanguage !== isFrench) {
    setPositionedLanguage(isFrench);
    setBallVisible(false);
  }

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

  // Reposition the ball once the DOM has settled after a route or language change
  useLayoutEffect(() => {
    if (activeRouteIndex === -1) return;

    const timer = setTimeout(() => {
      currentPosition.current.x = getItemCenterPosition(activeRouteIndex);
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
