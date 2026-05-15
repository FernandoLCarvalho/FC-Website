import Image from "next/image";
import { Link } from "@/i18n/routing";
import styles from "../styles.module.css";

export interface NavMenuItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
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
                <button onClick={item.onClick} className={styles.navItemButton}>
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

      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <button
            onClick={onToggleMobileMenu}
            className={styles.mobileCloseButton}
          >
            &times;
          </button>

          <nav>
            <ul className={styles.mobileNavList}>
              {items.map((item) => (
                <li key={item.id}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={styles.mobileNavLink}
                      onClick={onToggleMobileMenu}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      onClick={item.onClick}
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

      {isMobileMenuOpen && (
        <div className={styles.backdrop} onClick={onToggleMobileMenu} />
      )}
    </>
  );
}
