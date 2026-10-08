import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import IconButton from "@components/ui/iconButton";
import NavItem, { type NavItemProps } from "@components/ui/navItem";
import { useMobileMenuFocus } from "../hook/useMobileMenuFocus";
import { MOBILE_MENU_EXIT_MS } from "@/constants/navigation";
import styles from "../styles.module.css";

export type NavMenuItem =
  | (Omit<Extract<NavItemProps, { href: string }>, "variant" | "onActivate"> & {
      visibleOnMobile?: boolean;
    })
  | (Omit<
      Extract<NavItemProps, { onClick: () => void }>,
      "variant" | "onActivate"
    > & { visibleOnMobile?: boolean });

interface MenuItemsProps {
  isMobileMenuOpen: boolean;
  items: readonly NavMenuItem[];
  onClosePanel: () => void;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
}

export default function MenuItems({
  isMobileMenuOpen,
  items,
  onClosePanel,
  onToggleMobileMenu,
  onCloseMobileMenu,
}: MenuItemsProps) {
  const t = useTranslations();
  const [shouldRenderMobileMenu, setShouldRenderMobileMenu] =
    useState(isMobileMenuOpen);
  const { drawerRef, triggerRef } = useMobileMenuFocus(
    isMobileMenuOpen,
    shouldRenderMobileMenu,
    onCloseMobileMenu,
  );
  const mobileItems = items.filter((item) => item.visibleOnMobile !== false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      // Mount immediately on open; retain the original delayed exit.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldRenderMobileMenu(true);
      return;
    }
    const timer = window.setTimeout(
      () => setShouldRenderMobileMenu(false),
      MOBILE_MENU_EXIT_MS,
    );
    return () => window.clearTimeout(timer);
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className={styles.navDesktop}>
        <ul className={styles.navList}>
          {items.map((item) => (
            <li key={item.id}>
              <NavItem
                {...item}
                variant="desktop"
                onActivate={item.href !== undefined ? onClosePanel : undefined}
              />
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.hamburgerWrapper}>
        <IconButton
          ref={triggerRef}
          variant="menu"
          label={t("OPEN_MENU")}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          onClick={onToggleMobileMenu}
        >
          <Image
            src="/menu-icon.svg"
            alt=""
            width={24}
            height={24}
            className={styles.menuIcon}
          />
        </IconButton>
      </div>
      {shouldRenderMobileMenu && (
        <div
          id="mobile-menu"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("NAVIGATION_MENU")}
          tabIndex={-1}
          inert={!isMobileMenuOpen}
          className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : styles.mobileMenuClosed}`}
        >
          <IconButton
            variant="drawerClose"
            label={t("CLOSE_MENU")}
            className={styles.drawerClosePlacement}
            onClick={onCloseMobileMenu}
          >
            &times;
          </IconButton>
          <nav className={styles.mobileNav}>
            <ul className={styles.mobileNavList}>
              {mobileItems.map((item) => (
                <li key={item.id} className={styles.mobileNavItem}>
                  <NavItem
                    {...item}
                    variant="mobile"
                    onActivate={() => {
                      if (item.href !== undefined) onClosePanel();
                      onCloseMobileMenu();
                    }}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
      {shouldRenderMobileMenu && (
        <div
          aria-hidden="true"
          data-menu-backdrop
          className={`${styles.backdrop} ${isMobileMenuOpen ? styles.backdropOpen : styles.backdropClosed}`}
          onClick={onCloseMobileMenu}
        />
      )}
    </>
  );
}
