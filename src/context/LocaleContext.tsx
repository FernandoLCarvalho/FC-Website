"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { Locale } from "@/utils/i18n/locale";

interface ILocaleContextValue {
  locale: Locale;
}

interface ILocaleProvider {
  children: ReactNode;
  locale: Locale;
}

const LocaleContext = createContext<ILocaleContextValue | undefined>(undefined);

export function useLocale(): ILocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

export function LocaleProvider({ children, locale }: ILocaleProvider) {
  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  );
}
