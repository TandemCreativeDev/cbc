"use client";

import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

interface CheckboxProps {
  id: string;
  name: string;
  label: string;
  labelClass?: string;
  url: string;
  urlText: string;
  required?: boolean;
}

export default function Checkbox({
  id,
  name,
  label,
  labelClass,
  url,
  urlText,
  required = false,
}: CheckboxProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="flex gap-2 pb-6 col-span-2">
      {prefersReducedMotion ? (
        <input
          id={id}
          name={name}
          type="checkbox"
          required={required}
          className="block"
        />
      ) : (
        <div className="checkbox-wrapper-30">
          <span className="checkbox">
            <input
              id={id}
              name={name}
              type="checkbox"
              required={required}
              className="block focus:ring-2 focus:ring-clarks-orange focus:outline-none"
            />
            <svg>
              <use xlinkHref="#checkbox-30" className="checkbox"></use>
            </svg>
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" className="hidden">
            <symbol id="checkbox-30" viewBox="0 0 22 22">
              <path
                fill="none"
                stroke="black"
                d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 
                  c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
              />
            </symbol>
          </svg>
        </div>
      )}
      <label htmlFor={id} className={twMerge("text-sm/6", labelClass)}>
        {label}{" "}
        <a
          target="_blank"
          href={url}
          className="text-clarks-orange focus:ring-clarks-orange focus:ring-2 focus:outline-none hover:underline"
        >
          {urlText}
        </a>
      </label>
    </div>
  );
}
