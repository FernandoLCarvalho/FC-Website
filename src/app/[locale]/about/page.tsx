import styles from "./styles.module.css";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Technologies } from "@/constants/technologies";

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("ABOUT")}</h1>

      <Image
        src={"/Me.png"}
        alt="Fernando Carvalho"
        width={200}
        height={300}
        className={styles.avatar}
      />

      <p className={styles.description}>{t("DESCRIPTION")}</p>

      <div className={styles.techGrid}>
        {Technologies.map((tech, index) => (
          <div key={index} className={styles.techCard}>
            <Image
              src={tech.image}
              alt={tech.name}
              width={40}
              height={40}
              className={styles.techIcon}
            />
            <h3 className={styles.techName}>{tech.name}</h3>
          </div>
        ))}
      </div>

      <div className={styles.mapSection}>
        <h2>{t("CURRENTLY")}</h2>
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_API_KEY}&q=-16.6864,-49.2643`}
          width="350"
          height="350"
          className={styles.map}
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}
