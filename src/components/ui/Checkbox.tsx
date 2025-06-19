"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

import { useLanguage } from "@/context/LanguageContext";

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
  const [error, setError] = useState("");
  const { isFrench } = useLanguage();

  const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.currentTarget.validity.valueMissing) {
      setError(isFrench ? "Ce champ est obligatoire" : "This field is required");
    }
  };

  const handleInput = () => {
    setError("");
  };

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
        <>
          <input
            id={id}
            name={name}
            type="checkbox"
            required={required}
            className="block"
            onInvalid={handleInvalid}
            onInput={handleInput}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
          {error && (
            <p
              id={`${id}-error`}
              className="mt-1 text-red-600"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          )}
        </>
      ) : (
        <div className="checkbox-wrapper-30">
          <span className="checkbox">
            <input
              id={id}
              name={name}
              type="checkbox"
              required={required}
              className="block focus:ring-2 focus:ring-clarks-orange focus:outline-none"
              onInvalid={handleInvalid}
              onInput={handleInput}
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
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
      {error && !prefersReducedMotion && (
        <p
          id={`${id}-error`}
          className="mt-1 text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
      <label htmlFor={id} className={twMerge("text-sm/6", labelClass)}>
        {label}{" "}
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            isFrench
              ? "Voir la politique de confidentialité"
              : "See our Privacy policy"
          }
          role="link"
          className="text-clarks-orange focus:ring-clarks-orange focus-visible:ring-2 focus:outline-none hover:underline"
        >
          {urlText}
        </Link>
      </label>
    </div>
  );
}
