import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { technologies } from "@/constants/technologies";
import styles from "./about-view.module.css";

const CURRENT_LOCATION_COORDINATES = "-16.6864,-49.2643";
const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps/embed/v1/place";

function buildCurrentLocationMapUrl(apiKey: string) {
  const params = new URLSearchParams({
    key: apiKey,
    q: CURRENT_LOCATION_COORDINATES,
  });

  return `${GOOGLE_MAPS_EMBED_URL}?${params.toString()}`;
}

export default async function AboutView() {
  const t = await getTranslations();
  const mapsApiKey = process.env.NEXT_PUBLIC_API_KEY;
  const currentLocationMapUrl = mapsApiKey
    ? buildCurrentLocationMapUrl(mapsApiKey)
    : null;

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
          {technologies.map((tech) => (
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
                <span className={styles.techBadge}>{tech.badgeLabel}</span>
              )}
              <h2 className={styles.techName}>{tech.name}</h2>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.mapSection}>
        <h2 className={styles.sectionTitle}>{t("CURRENTLY")}</h2>
        {currentLocationMapUrl ? (
          <iframe
            src={currentLocationMapUrl}
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
