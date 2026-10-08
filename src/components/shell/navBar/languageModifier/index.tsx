import { useTranslations } from "next-intl";
import type { ChangeEvent } from "react";
import { isSupportedLocale, type Locale } from "@/utils/i18n/locale";
import styles from "../styles.module.css";

interface LanguageModifierProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export default function LanguageModifier({
  locale,
  onLocaleChange,
}: LanguageModifierProps) {
  const t = useTranslations();
  const handleLanguageSelectChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedLocale = event.target.value;
    if (!isSupportedLocale(selectedLocale)) return;

    onLocaleChange(selectedLocale);
  };

  return (
    <div className={styles.languageWrapper}>
      <select
        aria-label={t("SELECT_LANGUAGE")}
        value={locale}
        onChange={handleLanguageSelectChange}
        className={styles.languageSelect}
      >
        <option value="en" className={styles.languageOption}>
          EN
        </option>
        <option value="pt" className={styles.languageOption}>
          PT-BR
        </option>
        <option value="es" className={styles.languageOption}>
          ES
        </option>
      </select>
    </div>
  );
}
