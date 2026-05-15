import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { isSupportedLocale } from "@/utils/i18n/locale";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = isSupportedLocale(requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
