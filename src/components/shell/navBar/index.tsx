"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

import { useLocale } from "@/context/LocaleContext";
import type { Locale } from "@/utils/i18n/locale";
import { Toast } from "primereact/toast";
import AssetCredits from "@components/shell/assetCredits";
import { useNavHeaderHeightCssVariable } from "./hook/useNavHeaderHeightCssVariable";
import LanguageModifier from "./languageModifier";
import NavBarLogo from "./logo";
import MenuItems, { type NavMenuItem } from "./menuItems";

function isHomePath(pathname: string) {
  return pathname === "/";
}

export default function NavBar() {
  const headerRef = useNavHeaderHeightCssVariable();
  const [isOpen, setIsOpen] = useState(false);
  const [isAssetCreditsOpen, setIsAssetCreditsOpen] = useState(false);
  const t = useTranslations();
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { locale } = useLocale();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const showToast = (phrase: string) => {
    toast.current?.show({
      severity: "warn",
      summary: t("WARN"),
      detail: phrase,
      life: 5000,
    });
  };

  const toggleAssetCredits = () => {
    if (isHomePath(pathname)) {
      setIsAssetCreditsOpen((prev) => !prev);
      return;
    }

    showToast(t("ASSET_CREDITS_HOME_ONLY"));
    setIsAssetCreditsOpen(false);
  };

  useEffect(() => {
    setIsAssetCreditsOpen(false);
  }, [pathname]);

  const handleLocaleChange = (newLocale: Locale) => {
    router.push(pathname, { locale: newLocale });
  };

  const menuItems: NavMenuItem[] = [
    { id: "home", label: t("HOME"), href: "/" },
    { id: "about", label: t("ABOUT"), href: "/about" },
    {
      id: "assetCredits",
      label: t("ASSET_CREDITS"),
      onClick: toggleAssetCredits,
    },
  ];

  return (
    <header ref={headerRef} className={styles.header}>
      <Toast ref={toast} />

      <NavBarLogo />

      <MenuItems
        isMobileMenuOpen={isOpen}
        items={menuItems}
        onClosePanel={() => setIsAssetCreditsOpen(false)}
        onToggleMobileMenu={toggleMenu}
      />

      <LanguageModifier locale={locale} onLocaleChange={handleLocaleChange} />

      <div
        className={`${styles.assetCreditsPanel} ${
          isAssetCreditsOpen ? styles.show : styles.hide
        }`}
      >
        <button
          onClick={toggleAssetCredits}
          className={styles.assetCreditsCloseButton}
        >
          &times;
        </button>

        <AssetCredits />
      </div>
    </header>
  );
}
