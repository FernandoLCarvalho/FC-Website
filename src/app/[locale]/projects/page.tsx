import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ProjectsView from "@components/projects";
import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/utils/i18n/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) notFound();
  const t = await getTranslations({ locale });
  const title = `${t("PROJECTS")} | Fernando Carvalho`;
  const description = t("PROJECT_NUTRIBUILDER_DESCRIPTION");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${locale}/projects`,
    },
    twitter: { title, description },
  };
}

export default ProjectsView;
