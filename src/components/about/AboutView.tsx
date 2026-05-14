import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Technologies } from "@/constants/technologies";
import styles from "./about-view.module.css";

export default async function AboutView() {
  const t = await getTranslations();
  const mapsApiKey = process.env.NEXT_PUBLIC_API_KEY;

  return (
    <div className={styles.container}>
      <section className={styles.profileSection}>
        <h1 className={styles.title}>{t("ABOUT")}</h1>

        <Image
          src="/me.png"
          alt="Fernando Carvalho"
          width={180}
          height={270}
          className={styles.avatar}
          priority
        />

        <p className={styles.description}>{t("DESCRIPTION")}</p>

        <div className={styles.techGrid}>
          {Technologies.map((tech) => (
            <article key={tech.name} className={styles.techCard}>
              {tech.image ? (
                <Image
                  src={tech.image}
                  alt=""
                  width={36}
                  height={36}
                  className={styles.techIcon}
                />
              ) : (
                <span className={styles.techBadge}>CSS</span>
              )}
              <h2 className={styles.techName}>{tech.name}</h2>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.mapSection}>
        <h2 className={styles.sectionTitle}>{t("CURRENTLY")}</h2>
        {mapsApiKey ? (
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=-16.6864,-49.2643`}
            className={styles.map}
            title={t("LOCATION")}
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <p className={styles.locationFallback}>{t("LOCATION")}</p>
        )}
      </section>
    </div>
  );
}
