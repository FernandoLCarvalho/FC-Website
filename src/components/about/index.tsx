import { buildCurrentLocationMapUrl } from "./locationMap";
import LocationSection from "./locationSection";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { professionalCompetencies } from "@/constants/technologies";
import PageContainer from "@components/ui/pageContainer";
import ContentSection from "@components/ui/contentSection";
import SectionTitle from "@components/ui/sectionTitle";
import Card from "@components/ui/card";
import CardGrid from "@components/ui/cardGrid";
import ChipList from "@components/ui/chipList";
import Eyebrow from "@components/ui/eyebrow";
import styles from "./about-view.module.css";

export default async function AboutView() {
  const t = await getTranslations();
  const mapsApiKey = process.env.NEXT_PUBLIC_API_KEY;
  const currentLocationMapUrl = mapsApiKey
    ? buildCurrentLocationMapUrl(mapsApiKey)
    : null;

  return (
    <PageContainer>
      <ContentSection>
        <SectionTitle as="h1" variant="page">
          {t("ABOUT")}
        </SectionTitle>

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
            <Eyebrow variant="profile">{t("ABOUT_ROLE")}</Eyebrow>
            <p className={styles.description}>{t("ABOUT_INTRO")}</p>
            <p className={styles.description}>{t("ABOUT_VOLPIE")}</p>
            <p className={styles.description}>{t("ABOUT_BACKEND")}</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection spacing="section" align="center">
        <SectionTitle as="h2" variant="section">
          {t("TECH_SECTION_TITLE")}
        </SectionTitle>
        <p className={styles.sectionDescription}>
          {t("SPEC_DRIVEN_AI_WORKFLOWS_DESCRIPTION")}
        </p>

        <CardGrid>
          {professionalCompetencies.map((competency) => (
            <Card key={competency.id}>
              <SectionTitle as="h3" variant="card">
                {t(competency.titleKey)}
              </SectionTitle>
              <p className={styles.techDescription}>
                {t(competency.descriptionKey)}
              </p>
              <ChipList items={competency.tools} />
            </Card>
          ))}
        </CardGrid>
      </ContentSection>

      <LocationSection
        mapUrl={currentLocationMapUrl}
        labels={{
          title: t("CURRENTLY"),
          description: t("LOCATION_API_DESCRIPTION"),
          mapTitle: t("LOCATION_MAP_TITLE"),
          fallback: t("LOCATION_FALLBACK"),
        }}
      />
    </PageContainer>
  );
}
