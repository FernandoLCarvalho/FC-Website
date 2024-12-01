"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useRef, useState } from "react";
import styles from "../../styles/navbar.module.css";
import Faq from "./Feature/Faq";
import { useLocale } from "@/context/LocaleContext";
import { Toast } from "primereact/toast";

interface MenuItems {
  label: string;
  url?: string;
}

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const t = useTranslations();
  const toast = useRef<Toast>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const show = (phrase: string) => {
    toast.current?.show({
      severity: "warn",
      summary: t("WARN"),
      detail: phrase,
      life: 5000,
    });
  };

  const openFAQ = () => {
    if (window.location.pathname.split("/").slice(2).join("/") === "") {
      setIsFAQOpen(!isFAQOpen);
    } else {
      show(t("FAQ"));
    }
  };

  type Locale = "en" | "pt" | "es";

  const { locale } = useLocale();

  const handleLocaleChange = (newLocale: Locale) => {
    const currentPath = window.location.pathname.split("/").slice(2).join("/");
    const newPath = `/${newLocale}/${currentPath}`;
    window.location.href = newPath;
  };

  const menuItems: MenuItems[] = [
    { label: t("HOME"), url: "/" },
    { label: t("ABOUT"), url: "/about" },
    { label: t("CONTACT"), url: "/contact" },
    { label: "FAQ" },
  ];

  return (
    <header className="grid grid-cols-3 sm:grid-cols-3 md:grid-col-2 items-center px-16 bg-transparent shadow-md w-full h-18 mx-auto">
      <Toast ref={toast} />
      {/* Logo */}
      <div className="flex items-center justify-start">
        <Image
          src="/Logo.svg"
          alt="Logo"
          width={50}
          height={50}
          style={{ minWidth: "15%" }}
          loading="lazy"
        />
      </div>

      {/* Large screen navigation menu */}
      <nav className="hidden sm:flex justify-center">
        <ul className="flex space-x-16 text-black whitespace-nowrap text-white">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.url ? (
                <Link
                  href={item.url}
                  className="hover:text-blue-500"
                  onClick={() => setIsFAQOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <button onClick={openFAQ} className="hover:text-blue-500">
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex justify-center sm:hidden items-center">
        <button
          onClick={toggleMenu}
          className="text-white focus:outline-none h-9 w-9 sm:h-8 md:h-7 lg:h-10"
        >
          <Image
            src="/menu-icon.svg"
            alt="Menu Icon"
            width={24}
            height={24}
            className="w-full"
          />
        </button>
      </div>

      {isOpen && (
        <div className="fixed top-0 left-0 w-0.33 h-full bg-gray-900 bg-opacity-95 z-50 flex flex-col items-start p-8">
          <button
            onClick={toggleMenu}
            className="self-end mb-8 text-white text-2xl focus:outline-none"
          >
            &times;
          </button>
          <nav>
            <ul className="space-y-8 text-white text-lg mt-16 whitespace-nowrap">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.url ? (
                    <Link
                      href={item.url}
                      className="hover:text-blue-300"
                      onClick={toggleMenu}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button onClick={openFAQ} className="hover:text-blue-300">
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Click outside to close the menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Language Switcher */}
      <div className="flex items-center justify-end space-x-4 w-full">
        <select
          value={locale}
          onChange={(e) => handleLocaleChange(e.target.value as Locale)}
          className="bg-transparent text-white border border-gray-500 px-2 py-1 rounded cursor-pointer hover:border-blue-300 focus:outline-none text-sm"
        >
          <option value="en" className="bg-black text-white">
            EN
          </option>
          <option value="pt" className="bg-black text-white">
            PT-BR
          </option>
          <option value="es" className="bg-black text-white">
            ES
          </option>
        </select>
      </div>

      {/* FAQ Section */}
      <div
        className={`${styles.faqContainer} ${
          isFAQOpen ? styles.show : styles.hide
        }`}
      >
        <button onClick={openFAQ} className="text-white mb-1">
          &times;
        </button>

        <Faq />
      </div>
    </header>
  );
}
