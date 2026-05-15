"use client";

import dynamic from "next/dynamic";
import localStyles from "./main-section.module.css";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { contact } from "@/constants/contact";

const StarClusterScene = dynamic(
  () => import("@components/three/starClusterScene"),
);

function buildWhatsAppContactUrl(message: string) {
  const phoneNumber = contact.whatsAppPhoneNumber;
  if (!phoneNumber) return null;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

function mailToContactUrl(email: string, subject: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

export default function MainSection() {
  const t = useTranslations();
  const homeName = t("HOME_NAME");
  const homeNameWords = homeName.split(" ");
  const whatsAppContactUrl = buildWhatsAppContactUrl(t("WHATSAPP_CONTACT"));
  const contactOptions = [
    {
      href: whatsAppContactUrl,
      iconClassName: "pi pi-whatsapp",
      label: t("WHATSAPP_CTA"),
    },
    {
      href: mailToContactUrl(contact.email, t("EMAIL_SUBJECT")),
      iconClassName: "pi pi-envelope",
      label: t("EMAIL_CTA"),
    },
    {
      href: contact.githubUrl,
      iconClassName: "pi pi-github",
      label: t("GITHUB_CTA"),
    },
    {
      href: contact.linkedInUrl,
      iconClassName: "pi pi-linkedin",
      label: t("LINKEDIN_CTA"),
    },
  ];

  const openContactInNewTab = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
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
        <p className={localStyles.role}>{t("HOME_ROLE")}</p>

        <h1 className={localStyles.title} aria-label={homeName}>
          {homeNameWords.map((word, wordIndex) => (
            <span
              key={`${word}-${wordIndex}`}
              aria-hidden="true"
              className={localStyles.shineWord}
            >
              {Array.from(word).map((character, characterIndex) => {
                const previousWordsLength = homeNameWords
                  .slice(0, wordIndex)
                  .join("").length;
                const shineIndex =
                  previousWordsLength + wordIndex + characterIndex;

                return (
                  <span
                    key={`${word}-${character}-${characterIndex}`}
                    className={localStyles.shineLetter}
                    style={{ "--shine-index": shineIndex } as CSSProperties}
                  >
                    {character}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <p className={localStyles.paragraph}>{t("BUILDING_SOLUTIONS")}</p>
        <p className={localStyles.credential}>
          {t("HOME_VOLPIE_CREDENTIAL")}
        </p>

        <div className={localStyles.contactActions}>
          {contactOptions.map((option) => (
            <button
              key={option.label}
              className={localStyles.contactButton}
              disabled={!option.href}
              onClick={() => {
                if (!option.href) return;

                openContactInNewTab(option.href);
              }}
              type="button"
            >
              <i className={option.iconClassName} aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </article>

      <div className={localStyles.sceneWrapper}>
        <StarClusterScene />
      </div>
    </section>
  );
}
