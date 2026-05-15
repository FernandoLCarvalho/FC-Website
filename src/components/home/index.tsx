"use client";

import dynamic from "next/dynamic";
import localStyles from "./main-section.module.css";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { CSSProperties } from "react";

const StarClusterScene = dynamic(
  () => import("@components/three/starClusterScene"),
);

function buildWhatsAppContactUrl(message: string) {
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER?.trim();
  if (!phoneNumber) return null;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

export default function MainSection() {
  const t = useTranslations();
  const mainText = t("BUILDING_SOLUCTIONS");
  const whatsAppContactUrl = buildWhatsAppContactUrl(t("WHATSAPP_CONTACT"));

  const handleWhatsAppRedirect = () => {
    if (!whatsAppContactUrl) return;

    window.open(whatsAppContactUrl, "_blank", "noopener,noreferrer");
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
        <p className={localStyles.paragraph} aria-label={mainText}>
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

        <button
          className={localStyles.whatsAppButton}
          disabled={!whatsAppContactUrl}
          onClick={handleWhatsAppRedirect}
        >
          <span className={localStyles.whatsAppButtonLabel}>{t("QUOTE")}</span>
          <Image
            src="/WhatsApp.svg"
            alt="WhatsApp Icon"
            width={20}
            height={20}
          />
        </button>
      </article>

      <div className={localStyles.sceneWrapper}>
        <StarClusterScene />
      </div>
    </section>
  );
}
