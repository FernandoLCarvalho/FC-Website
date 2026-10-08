"use client";

import dynamic from "next/dynamic";
import localStyles from "./main-section.module.css";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { buildContactOptions } from "./contactOptions";
import { useContactWheelForwarding } from "./hook/useContactWheelForwarding";
import Button from "@components/ui/button";
import Eyebrow from "@components/ui/eyebrow";
import Icon from "@components/ui/icon";

const StarClusterScene = dynamic(
  () => import("@components/three/starClusterScene"),
);

export default function MainSection() {
  const t = useTranslations();
  const homeName = t("HOME_NAME");
  const homeNameWords = homeName.split(" ");
  const contactOptions = buildContactOptions(t);
  const sectionRef = useContactWheelForwarding();

  return (
    <section className={localStyles.section} ref={sectionRef}>
      <article className={localStyles.article}>
        <Eyebrow variant="home">{t("HOME_ROLE")}</Eyebrow>

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
        <p className={localStyles.credential}>{t("HOME_VOLPIE_CREDENTIAL")}</p>

        <div className={localStyles.contactActions}>
          {contactOptions.map((option) => (
            <Button
              key={option.id}
              startIcon={<Icon name={option.icon} />}
              disabled={!option.href}
              onClick={() => {
                if (!option.href) return;

                window.open(option.href, "_blank", "noopener,noreferrer");
              }}
              type="button"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </article>

      <div className={localStyles.sceneWrapper}>
        <StarClusterScene />
      </div>
    </section>
  );
}
