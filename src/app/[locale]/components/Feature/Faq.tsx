import { useTranslations } from "next-intl";
import styles from "./styles.module.css";

export default function Faq() {
  const t = useTranslations();

  return (
    <section className={styles.section}>
      <div className={styles.block}>
        <h2 className={styles.title}>- Scene Landpage</h2>

        <p className={styles.text}>License: CC Attribution</p>
        <p className={styles.text}>Author: Sebastian Sosnowski</p>

        <a
          href="https://sketchfab.com/3d-models/star-cluster-15k-stars-model-51148b78a37a4a72b22d8e06f4293e07"
          className={`${styles.link} ${styles.transitionFont}`}
        >
          Link
        </a>
      </div>

      <article className={styles.article}>
        <p>- {t("FAQ_02")}</p>
      </article>
    </section>
  );
}
