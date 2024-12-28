"use client";

import dynamic from "next/dynamic";
import styles from "@/styles/mainSection.module.css";
import { useTranslations } from "next-intl";
import Image from "next/image";

const Scene = dynamic(() => import("@/scenes/Scene"));

export default function MainSection() {
  const t = useTranslations();

  const handleWhatsAppRedirect = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;
    const message = encodeURIComponent(t("WHATSAPP_CONTACT"));
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.location.href = whatsappUrl;
  };

  return (
    <section className="flex flex-row items-center justify-center overflow-y-scroll h-screen">
      <article
        className="flex flex-col items-center justify-center ml-10 mr-10 w-full h-[100vh]"
        style={{ pointerEvents: "none", zIndex: "1", position: "relative" }}
      >
        <p className={`${styles.paragragh}`}>{t("BUILDING_SOLUCTIONS")}</p>

        <button
          className={`whitespace-nowrap uppercase ${styles.button}`}
          style={{ pointerEvents: "auto" }}
          onClick={handleWhatsAppRedirect}
        >
          <span>{t("QUOTE")}</span>
          <Image
            src="/WhatsApp.svg"
            alt="WhatsApp Icon"
            width={20}
            height={20}
          />
        </button>
      </article>

      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: "0",
        }}
      >
        <Scene />
      </div>
    </section>
  );
}
