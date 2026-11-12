"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import useIsMounted from "@/utils/useIsMounted";

interface LanguageContextType {
  isFrench: boolean;
  setIsFrench: (value: boolean) => void;
  isLoading: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const subscribe = () => () => {};

function detectIsFrench() {
  const lang = new URLSearchParams(window.location.search).get("isFrench");
  if (lang === "true" || lang === "false") return lang === "true";
  return navigator.language.toLowerCase().startsWith("fr");
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [chosen, setChosen] = useState<boolean | null>(null);
  const detected = useSyncExternalStore(subscribe, detectIsFrench, () => false);
  const isMounted = useIsMounted();
  const isFrench = chosen ?? detected;

  const handleSetIsFrench = useCallback((value: boolean) => {
    setChosen(value);
  }, []);

  useEffect(() => {
    document.documentElement.lang = isFrench ? "fr" : "en";
  }, [isFrench]);

  const value = {
    isFrench,
    setIsFrench: handleSetIsFrench,
    isLoading: !isMounted,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
