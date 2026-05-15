import { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

export function isSupportedLocale(locale: unknown): locale is Locale {
  return (
    typeof locale === "string" &&
    (routing.locales as readonly string[]).includes(locale)
  );
}
