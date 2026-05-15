"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

import { useLocale } from "@/context/LocaleContext";
import type { Locale } from "@/utils/i18n/locale";
import AssetCredits from "@components/shell/assetCredits";
import { useNavHeaderHeightCssVariable } from "./hook/useNavHeaderHeightCssVariable";
import LanguageModifier from "./languageModifier";
import NavBarLogo from "./logo";
import MenuItems, { type NavMenuItem } from "./menuItems";

export default function NavBar() {
  const headerRef = useNavHeaderHeightCssVariable();
  const assetCreditsPanelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAssetCreditsOpen, setIsAssetCreditsOpen] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const { locale } = useLocale();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const toggleAssetCredits = () => {
    setIsAssetCreditsOpen((prev) => !prev);
  };

  useEffect(() => {
    setIsAssetCreditsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isAssetCreditsOpen) return;

    const handlePointerDownOutsideCredits = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) return;
      if (assetCreditsPanelRef.current?.contains(target)) return;
      if (
        target instanceof Element &&
        target.closest('[data-nav-item-id="assetCredits"]')
      ) {
        return;
      }

      setIsAssetCreditsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDownOutsideCredits);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDownOutsideCredits,
      );
    };
  }, [isAssetCreditsOpen]);

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
      <NavBarLogo />

      <MenuItems
        isMobileMenuOpen={isOpen}
        items={menuItems}
        onClosePanel={() => setIsAssetCreditsOpen(false)}
        onToggleMobileMenu={toggleMenu}
      />

      <LanguageModifier locale={locale} onLocaleChange={handleLocaleChange} />

      <div
        ref={assetCreditsPanelRef}
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
