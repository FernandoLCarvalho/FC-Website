"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useState } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { label: t("HOME"), url: "/" },
    { label: t("ABOUT"), url: "/about" },
    { label: t("CONTACT"), url: "/contact" },
  ];

  return (
    <header className="grid grid-cols-3 sm:grid-cols-3 md:grid-col-2 items-center px-16 bg-white shadow-md w-full h-18 mx-auto ">
      {/* Logo */}
      <div className="flex items-center justify-start">
        <Image src="/Logo.svg" alt="Logo" width={100} height={100}/>
      </div>

      {/* Large screen navigation menu */}
      <nav className="hidden sm:flex justify-center">
        <ul className="flex space-x-16 text-black whitespace-nowrap">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.url} className="hover:text-blue-500">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex justify-center sm:hidden items-center">
        <button
          onClick={toggleMenu}
          className="text-gray-700 focus:outline-none h-9 w-9 sm:h-8 md:h-7 lg:h-10"
        >
          <svg
            className="w-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 18h16"></path>
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="fixed top-0 left-0 w-2/4 h-full bg-gray-900 bg-opacity-95 z-50 flex flex-col items-start p-8">
          <button
            onClick={toggleMenu}
            className="self-end mb-8 text-white text-2xl focus:outline-none"
          >
            &times; {/* This entity "&times" represents the "X" symbol for closing the menu */}
          </button>
          <nav>
            <ul className="space-y-8 text-white text-lg mt-16 whitespace-nowrap">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.url} className="hover:text-blue-300" onClick={toggleMenu}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
      
      {/* on Click outside the menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleMenu} 
        ></div>
      )}

    </header>
  );
}
