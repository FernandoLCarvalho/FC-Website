"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

import IconButton from "@components/ui/iconButton";
import { DESKTOP_NAV_MEDIA_QUERY } from "@/constants/navigation";
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

  const locale = useLocale();

  const closeMobileMenu = useCallback(() => setIsOpen(false), []);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const toggleAssetCredits = () => {
    setIsAssetCreditsOpen((prev) => !prev);
  };

  useEffect(() => {
    // Keep route-driven dismissal at the existing post-commit timing.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAssetCreditsOpen(false);
    setIsOpen(false);
  }, [pathname, locale]);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_NAV_MEDIA_QUERY);
    const closeOnDesktop = () => {
      if (media.matches) closeMobileMenu();
    };
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, [closeMobileMenu]);

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

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsAssetCreditsOpen(false);
      const trigger = Array.from(
        document.querySelectorAll<HTMLButtonElement>(
          '[data-nav-item-id="assetCredits"]',
        ),
      ).find(
        (element) =>
          element.getClientRects().length > 0 && !element.closest("[inert]"),
      );
      (
        trigger ??
        document.querySelector<HTMLButtonElement>(
          '[aria-controls="mobile-menu"]',
        )
      )?.focus();
    };
    document.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", handlePointerDownOutsideCredits);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener(
        "pointerdown",
        handlePointerDownOutsideCredits,
      );
    };
  }, [isAssetCreditsOpen]);

  const handleLocaleChange = (newLocale: Locale) => {
    router.push(`${pathname}${window.location.search}${window.location.hash}`, {
      locale: newLocale,
    });
  };

  const menuItems: NavMenuItem[] = [
    { id: "home", label: t("HOME"), href: "/" },
    { id: "about", label: t("ABOUT"), href: "/about" },
    { id: "projects", label: t("PROJECTS"), href: "/projects" },
    {
      id: "assetCredits",
      label: t("ASSET_CREDITS"),
      onClick: toggleAssetCredits,
      expanded: isAssetCreditsOpen,
      controls: "asset-credits-panel",
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
        onCloseMobileMenu={closeMobileMenu}
      />

      <LanguageModifier locale={locale} onLocaleChange={handleLocaleChange} />

      <div
        id="asset-credits-panel"
        inert={!isAssetCreditsOpen || isOpen}
        ref={assetCreditsPanelRef}
        className={`${styles.assetCreditsPanel} ${
          isAssetCreditsOpen ? styles.show : styles.hide
        }`}
      >
        <IconButton
          variant="panelClose"
          label={t("CLOSE_CREDITS")}
          onClick={() => setIsAssetCreditsOpen(false)}
          className={styles.panelClosePlacement}
        >
          &times;
        </IconButton>

        <AssetCredits />
      </div>
    </header>
  );
}
