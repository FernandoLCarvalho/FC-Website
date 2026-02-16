"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

import { useLocale } from "@/context/LocaleContext";
import { Toast } from "primereact/toast";
import Faq from "../Feature/Faq";

interface MenuItems {
  label: string;
  url?: string;
}

export default function NavBar() {
  const headerRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const t = useTranslations();
  const toast = useRef<Toast>(null);
  const router = useRouter();
  const pathname = usePathname();

  type Locale = "en" | "pt" | "es";
  const { locale } = useLocale();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const show = (phrase: string) => {
    toast.current?.show({
      severity: "warn",
      summary: t("WARN"),
      detail: phrase,
      life: 5000,
    });
  };

  const openFAQ = () => {
    const isHomePage = window.location.pathname.split("/").slice(2).join("");

    if (isHomePage === "") {
      setIsFAQOpen((prev) => !prev);
    } else {
      show(t("FAQ"));
      setIsFAQOpen(false);
    }
  };

  useEffect(() => {
    setIsFAQOpen(false);
  }, [pathname]);

  const handleLocaleChange = (newLocale: Locale) => {
    router.push(pathname, { locale: newLocale });
  };

  const menuItems: MenuItems[] = [
    { label: t("HOME"), url: "/" },
    { label: t("ABOUT"), url: "/about" },
    { label: "FAQ" },
  ];

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const set = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--nav-h", `${h}px`);
    };

    set();

    const ro = new ResizeObserver(set);
    ro.observe(el);

    window.addEventListener("resize", set);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", set);
    };
  }, []);

  return (
    <header className={styles.header}>
      <Toast ref={toast} />

      <div className={styles.logoWrapper}>
        <Image
          src="/Logo.svg"
          alt="Logo"
          width={50}
          height={50}
          className={styles.logo}
          loading="lazy"
        />
      </div>

      <nav className={styles.navDesktop}>
        <ul className={styles.navList}>
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.url ? (
                <Link
                  href={item.url}
                  className={styles.navItemLink}
                  onClick={() => setIsFAQOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <button onClick={openFAQ} className={styles.navItemButton}>
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.hamburgerWrapper}>
        <button onClick={toggleMenu} className={styles.hamburgerButton}>
          <Image
            src="/menu-icon.svg"
            alt="Menu Icon"
            width={24}
            height={24}
            className={styles.menuIcon}
          />
        </button>
      </div>

      {isOpen && (
        <div className={styles.mobileMenu}>
          <button onClick={toggleMenu} className={styles.mobileCloseButton}>
            &times;
          </button>

          <nav>
            <ul className={styles.mobileNavList}>
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.url ? (
                    <Link
                      href={item.url}
                      className={styles.mobileNavLink}
                      onClick={toggleMenu}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      onClick={openFAQ}
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

      {isOpen && <div className={styles.backdrop} onClick={toggleMenu} />}

      <div className={styles.languageWrapper}>
        <select
          value={locale}
          onChange={(e) => handleLocaleChange(e.target.value as Locale)}
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

      <div
        className={`${styles.faqContainer} ${
          isFAQOpen ? styles.show : styles.hide
        }`}
      >
        <button onClick={openFAQ} className={styles.faqCloseButton}>
          &times;
        </button>

        <Faq />
      </div>
    </header>
  );
}
