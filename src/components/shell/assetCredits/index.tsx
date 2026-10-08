"use client";

import { useTranslations } from "next-intl";
import ExternalLink from "@components/ui/externalLink";
import styles from "./asset-credits.module.css";

export default function AssetCredits() {
  const t = useTranslations();

  return (
    <section className={styles.section} aria-labelledby="asset-credits-title">
      <div className={styles.block}>
        <h2 id="asset-credits-title" className={styles.title}>
          {t("CREDIT_SCENE_TITLE")}
        </h2>

        <p className={styles.text}>
          {t("CREDIT_LICENSE", { license: "CC Attribution" })}
        </p>
        <p className={styles.text}>
          {t("CREDIT_AUTHOR", { author: "Sebastian Sosnowski" })}
        </p>

        <ExternalLink
          appearance="credit"
          href="https://sketchfab.com/3d-models/star-cluster-15k-stars-model-51148b78a37a4a72b22d8e06f4293e07"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sketchfab
        </ExternalLink>
      </div>

      <article className={styles.article}>
        <p>{t("SITE_TECH_NOTE")}</p>
      </article>
    </section>
  );
}
