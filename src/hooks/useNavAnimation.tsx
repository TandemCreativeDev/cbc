import { useEffect, useState } from "react";

export function useNavAnimation(
  activeIndex: number,
  prevIndex: number,
  refs: React.RefObject<(HTMLLIElement | null)[]>
) {
  const [animationVars, setAnimationVars] = useState({
    "--prev-position": "0px",
    "--next-position": "0px",
  });

  useEffect(() => {
    if (activeIndex < 0 || !refs.current[activeIndex]) return;

    // Handle both initial position and animations
    const calculatePositions = () => {
      if (refs.current[prevIndex] && activeIndex !== prevIndex) {
        const prevRect = refs.current[prevIndex]?.getBoundingClientRect();
        const activeRect = refs.current[activeIndex]?.getBoundingClientRect();
        const navRect = refs.current[0]?.parentElement?.getBoundingClientRect();

        if (!prevRect || !activeRect || !navRect) return;

        const prevPos = prevRect.left - navRect.left + prevRect.width / 2 - 12;
        const nextPos =
          activeRect.left - navRect.left + activeRect.width / 2 - 12;

        setAnimationVars({
          "--prev-position": `${prevPos}px`,
          "--next-position": `${nextPos}px`,
        });
      } else if (refs.current[activeIndex]) {
        const activeRect = refs.current[activeIndex]?.getBoundingClientRect();
        const navRect = refs.current[0]?.parentElement?.getBoundingClientRect();

        if (!activeRect || !navRect) return;

        const nextPos =
          activeRect.left - navRect.left + activeRect.width / 2 - 12;

        setAnimationVars({
          "--prev-position": `${nextPos}px`,
          "--next-position": `${nextPos}px`,
        });
      }
    };

    // Small delay to ensure the DOM is ready
    const timer = setTimeout(() => {
      calculatePositions();
    }, 50);

    const handleResize = () => {
      calculatePositions();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [activeIndex, prevIndex, refs]);

  return animationVars as React.CSSProperties;
}
