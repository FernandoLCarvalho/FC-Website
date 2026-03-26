"use client";

import dynamic from "next/dynamic";
import localStyles from "./main-section.module.css";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { SectionHeading } from "@/components/atoms/SectionHeading/SectionHeading";

const Scene = dynamic(() => import("@/three/components/Scene"));

export default function MainSection() {
  const t = useTranslations();

  const handleWhatsAppRedirect = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;
    const message = encodeURIComponent(t("WHATSAPP_CONTACT"));
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className={localStyles.section}>
      <article className={localStyles.article}>
        <SectionHeading as="h1" className={localStyles.paragragh}>
          {t("BUILDING_SOLUCTIONS")}
        </SectionHeading>

        <button className={localStyles.button} onClick={handleWhatsAppRedirect}>
          <span>{t("QUOTE")}</span>
          <Image
            src="/WhatsApp.svg"
            alt="WhatsApp Icon"
            width={20}
            height={20}
          />
        </button>
      </article>

      <div className={localStyles.sceneWrapper}>
        <Scene />
      </div>
    </section>
  );
}
