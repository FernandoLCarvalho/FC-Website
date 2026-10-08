import type messages from "../../messages/en.json";
import type { Locale } from "@/utils/i18n/locale";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
