"use client";

import React, { createContext, useContext } from "react";

type Locale = "en" | "pt" | "es";

interface ILocaleContext {
  locale: Locale;
}

const LocaleContext = createContext<ILocaleContext | undefined>(undefined);

interface ILocaleProviderProps {
  children: React.ReactNode;
  locale: Locale;
}

export const LocaleProvider: React.FC<ILocaleProviderProps> = ({
  children,
  locale,
}) => {
  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): ILocaleContext => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};
