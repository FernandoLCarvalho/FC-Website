"use client";

import React, { createContext, useContext } from "react";
import { usePathname } from "next/navigation";

type Locale = "en" | "pt" | "es";

interface LocaleContextProps {
  locale: Locale;
}

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] as Locale;

  return (
    <LocaleContext.Provider value={{ locale }}>
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
