import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { professionalCompetencies } from "@/constants/technologies";
import styles from "./about-view.module.css";

const APPROXIMATE_LOCATION_QUERY = "Goiania, Brazil";
const GOOGLE_MAPS_EMBED_URL = "https://www.google.com/maps/embed/v1/place";

function buildCurrentLocationMapUrl(apiKey: string) {
  const params = new URLSearchParams({
    key: apiKey,
    q: APPROXIMATE_LOCATION_QUERY,
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

        <div className={styles.profileIntro}>
          <Image
            src="/me.png"
            alt="Fernando Carvalho"
            width={180}
            height={270}
            className={styles.avatar}
            priority
          />

          <div className={styles.profileCopy}>
            <p className={styles.role}>{t("ABOUT_ROLE")}</p>
            <p className={styles.description}>{t("ABOUT_INTRO")}</p>
            <p className={styles.description}>{t("ABOUT_VOLPIE")}</p>
            <p className={styles.description}>{t("ABOUT_BACKEND")}</p>
          </div>
        </div>
      </section>

      <section className={styles.competencySection}>
        <h2 className={styles.sectionTitle}>{t("TECH_SECTION_TITLE")}</h2>
        <p className={styles.sectionDescription}>
          {t("SPEC_DRIVEN_AI_WORKFLOWS_DESCRIPTION")}
        </p>

        <div className={styles.techGrid}>
          {professionalCompetencies.map((competency) => (
            <article key={competency.id} className={styles.techCard}>
              <h3 className={styles.techName}>{t(competency.titleKey)}</h3>
              <p className={styles.techDescription}>
                {t(competency.descriptionKey)}
              </p>
              <ul className={styles.toolList}>
                {competency.tools.map((tool) => (
                  <li key={tool} className={styles.toolItem}>
                    {tool}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.mapSection}>
        <h2 className={styles.sectionTitle}>{t("CURRENTLY")}</h2>
        <p className={styles.mapDescription}>{t("LOCATION_API_DESCRIPTION")}</p>
        {currentLocationMapUrl ? (
          <iframe
            src={currentLocationMapUrl}
            className={styles.map}
            title={t("LOCATION_MAP_TITLE")}
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <p className={styles.locationFallback}>{t("LOCATION_FALLBACK")}</p>
        )}
      </section>
    </div>
  );
}
