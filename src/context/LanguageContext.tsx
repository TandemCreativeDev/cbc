"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface LanguageContextType {
  isFrench: boolean;
  setIsFrench: (value: boolean) => void;
  isLoading: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [isFrench, setIsFrench] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        const response = await fetch("https://geolocation-db.com/json/");
        const data = await response.json();

        const isInFrance = data.country_code === "FR";
        console.log(
          "User location detected:",
          data.country_name,
          data.country_code
        );

        if (isInFrance) {
          console.log("User is in France, setting language to French");
          setIsFrench(true);
        } else {
          console.log("User is not in France, setting language to English");
          setIsFrench(false);
        }
      } catch (error) {
        console.error("Error detecting user location:", error);
        setIsFrench(false);
      } finally {
        setIsLoading(false);
      }
    };

    detectUserLocation();
  }, []);

  const handleSetIsFrench = useCallback((value: boolean) => {
    console.log("Setting language to:", value ? "French" : "English");
    setIsFrench(value);
  }, []);

  const value = {
    isFrench,
    setIsFrench: handleSetIsFrench,
    isLoading,
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
