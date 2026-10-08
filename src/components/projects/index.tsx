import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { NUTRIBUILDER } from "@/constants/projects";
import PageContainer from "@components/ui/pageContainer";
import ContentSection from "@components/ui/contentSection";
import SectionTitle from "@components/ui/sectionTitle";
import Card from "@components/ui/card";
import CardGrid from "@components/ui/cardGrid";
import ChipList from "@components/ui/chipList";
import ExternalLink from "@components/ui/externalLink";
import aboutStyles from "@components/about/about-view.module.css";
import styles from "./styles.module.css";

export default async function ProjectsView() {
  const t = await getTranslations();

  return (
    <PageContainer>
      <ContentSection align="center">
        <SectionTitle as="h1" variant="page">
          {t("PROJECTS")}
        </SectionTitle>
        <SectionTitle as="h2" variant="section">
          {t("PROJECTS_SECTION_TITLE")}
        </SectionTitle>
        <p className={aboutStyles.sectionDescription}>
          {t("PROJECTS_DESCRIPTION")}
        </p>

        <CardGrid>
          <Card aria-labelledby="nutribuilder-title">
            <Image
              src={NUTRIBUILDER.image}
              alt={t("PROJECT_NUTRIBUILDER_IMAGE_ALT")}
              width={1200}
              height={750}
              sizes="(max-width: 720px) calc(100vw - 80px), (max-width: 1008px) calc((100vw - 110px) / 2), 427px"
              className={styles.image}
              priority
            />
            <SectionTitle as="h3" variant="card" id="nutribuilder-title">
              <Image
                src={NUTRIBUILDER.icon}
                alt=""
                width={32}
                height={32}
                className={styles.icon}
              />
              {NUTRIBUILDER.name}
            </SectionTitle>
            <p className={aboutStyles.techDescription}>
              {t("PROJECT_NUTRIBUILDER_DESCRIPTION")}
            </p>
            <p className={aboutStyles.techDescription}>
              {t("PROJECT_NUTRIBUILDER_LAUNCHED")}{" "}
              <time dateTime={NUTRIBUILDER.launchDate}>
                {t("PROJECT_NUTRIBUILDER_LAUNCH_DATE")}
              </time>
            </p>
            <ChipList
              items={[
                t("PROJECT_PERSONAL_TAG"),
                t("PROJECT_MEAL_PLANNING_TAG"),
                t("PROJECT_PDF_TAG"),
              ]}
            />
            <ExternalLink
              href={NUTRIBUILDER.url}
              appearance="action"
              className={styles.link}
            >
              {t("PROJECT_NUTRIBUILDER_VISIT")}
            </ExternalLink>
          </Card>
        </CardGrid>
      </ContentSection>
    </PageContainer>
  );
}
