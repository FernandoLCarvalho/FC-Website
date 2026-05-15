"use client";

import { useTranslations } from "next-intl";
import styles from "./asset-credits.module.css";

export default function AssetCredits() {
  const t = useTranslations();

  return (
    <section className={styles.section} aria-labelledby="asset-credits-title">
      <div className={styles.block}>
        <h2 id="asset-credits-title" className={styles.title}>
          Scene Landpage
        </h2>

        <p className={styles.text}>License: CC Attribution</p>
        <p className={styles.text}>Author: Sebastian Sosnowski</p>

        <a
          href="https://sketchfab.com/3d-models/star-cluster-15k-stars-model-51148b78a37a4a72b22d8e06f4293e07"
          className={`${styles.link} ${styles.transitionFont}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Sketchfab
        </a>
      </div>

      <article className={styles.article}>
        <p>{t("SITE_TECH_NOTE")}</p>
      </article>
    </section>
  );
}
