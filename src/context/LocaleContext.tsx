"use client";

import React, { createContext, useContext, useState } from "react";

type Locale = "en" | "pt" | "es";

interface LocaleContextProps {
    locale: Locale;
    setLocale: (locale: Locale) => void;
  }

  const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

  export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locale, setLocale] = useState<Locale>("en"); 

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
          {children}
        </LocaleContext.Provider>
      );
    };

    export const useLocale = (): LocaleContextProps => {
        const context = useContext(LocaleContext);
        if (!context) {
          throw new Error("useLocale must be used within a LocaleProvider");
        }
        return context;
      };