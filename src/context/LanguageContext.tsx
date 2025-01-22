"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface LanguageContextType {
  isFrench: boolean;
  setIsFrench: (value: boolean) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [isFrench, setIsFrench] = useState(false);

  const handleSetIsFrench = useCallback((value: boolean) => {
    console.log("Setting language to:", value ? "French" : "English");
    setIsFrench(value);
  }, []);

  const value = {
    isFrench,
    setIsFrench: handleSetIsFrench,
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
