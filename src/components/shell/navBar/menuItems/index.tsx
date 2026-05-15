import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import styles from "../styles.module.css";

const MOBILE_MENU_ANIMATION_MS = 220;

export interface NavMenuItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  visibleOnMobile?: boolean;
}

interface MenuItemsProps {
  isMobileMenuOpen: boolean;
  items: NavMenuItem[];
  onClosePanel: () => void;
  onToggleMobileMenu: () => void;
}

export default function MenuItems({
  isMobileMenuOpen,
  items,
  onClosePanel,
  onToggleMobileMenu,
}: MenuItemsProps) {
  const [shouldRenderMobileMenu, setShouldRenderMobileMenu] =
    useState(isMobileMenuOpen);
  const mobileItems = items.filter((item) => item.visibleOnMobile !== false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      setShouldRenderMobileMenu(true);
      return;
    }

    const animationTimer = window.setTimeout(() => {
      setShouldRenderMobileMenu(false);
    }, MOBILE_MENU_ANIMATION_MS);

    return () => window.clearTimeout(animationTimer);
  }, [isMobileMenuOpen]);

  const handleMobileLinkClick = () => {
    onClosePanel();
    onToggleMobileMenu();
  };

  const handleMobileButtonClick = (onClick?: () => void) => {
    onClick?.();
    onToggleMobileMenu();
  };

  return (
    <>
      <nav className={styles.navDesktop}>
        <ul className={styles.navList}>
          {items.map((item) => (
            <li key={item.id}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={styles.navItemLink}
                  onClick={onClosePanel}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  data-nav-item-id={item.id}
                  onClick={item.onClick}
                  className={styles.navItemButton}
                >
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.hamburgerWrapper}>
        <button onClick={onToggleMobileMenu} className={styles.hamburgerButton}>
          <Image
            src="/menu-icon.svg"
            alt="Menu Icon"
            width={24}
            height={24}
            className={styles.menuIcon}
          />
        </button>
      </div>

      {shouldRenderMobileMenu && (
        <div
          className={`${styles.mobileMenu} ${
            isMobileMenuOpen ? styles.mobileMenuOpen : styles.mobileMenuClosed
          }`}
        >
          <button
            onClick={onToggleMobileMenu}
            className={styles.mobileCloseButton}
          >
            &times;
          </button>

          <nav className={styles.mobileNav}>
            <ul className={styles.mobileNavList}>
              {mobileItems.map((item) => (
                <li key={item.id} className={styles.mobileNavItem}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={styles.mobileNavLink}
                      onClick={handleMobileLinkClick}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      data-nav-item-id={item.id}
                      onClick={() => handleMobileButtonClick(item.onClick)}
                      className={styles.mobileNavButton}
                    >
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {shouldRenderMobileMenu && (
        <div
          className={`${styles.backdrop} ${
            isMobileMenuOpen ? styles.backdropOpen : styles.backdropClosed
          }`}
          onClick={onToggleMobileMenu}
        />
      )}
    </>
  );
}
