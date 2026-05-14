"use client";

import dynamic from "next/dynamic";
import localStyles from "./main-section.module.css";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { CSSProperties } from "react";

const Scene = dynamic(() => import("@components/three/Scene"));

export default function MainSection() {
  const t = useTranslations();
  const mainText = t("BUILDING_SOLUCTIONS");

  const handleWhatsAppRedirect = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;
    const message = encodeURIComponent(t("WHATSAPP_CONTACT"));
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const forwardButtonWheelToCanvas = (
    event: React.WheelEvent<HTMLElement>,
  ) => {
    const target = event.target as HTMLElement;
    if (!target.closest("button")) return;

    const canvas = event.currentTarget.querySelector("canvas");
    if (!canvas) return;

    event.preventDefault();
    canvas.dispatchEvent(
      new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        clientX: event.clientX,
        clientY: event.clientY,
        ctrlKey: event.ctrlKey,
        deltaMode: event.deltaMode,
        deltaX: event.deltaX,
        deltaY: event.deltaY,
        deltaZ: event.deltaZ,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
      }),
    );
  };

  return (
    <section
      className={localStyles.section}
      onWheel={forwardButtonWheelToCanvas}
    >
      <article className={localStyles.article}>
        <p className={localStyles.paragragh} aria-label={mainText}>
          {Array.from(mainText).map((character, index) => (
            <span
              key={`${character}-${index}`}
              aria-hidden="true"
              className={localStyles.shineLetter}
              style={{ "--shine-index": index } as CSSProperties}
            >
              {character}
            </span>
          ))}
        </p>

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
