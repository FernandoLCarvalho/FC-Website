import ContentSection from "@components/ui/contentSection";
import SectionTitle from "@components/ui/sectionTitle";
import styles from "../about-view.module.css";

export interface LocationSectionProps {
  mapUrl: string | null;
  labels: {
    title: string;
    description: string;
    mapTitle: string;
    fallback: string;
  };
}

export default function LocationSection({
  mapUrl,
  labels,
}: LocationSectionProps) {
  return (
    <ContentSection width="narrow" spacing="map" align="center">
      <SectionTitle as="h2" variant="section">
        {labels.title}
      </SectionTitle>
      <p className={styles.mapDescription}>{labels.description}</p>
      {mapUrl ? (
        <iframe
          src={mapUrl}
          className={styles.map}
          title={labels.mapTitle}
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <p className={styles.locationFallback}>{labels.fallback}</p>
      )}
    </ContentSection>
  );
}
