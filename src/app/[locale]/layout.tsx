import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { isSupportedLocale } from "@/utils/i18n/locale";

import "../../styles/globals.css";
import styles from "./layout.module.css";

import { LocaleProvider } from "@/context/LocaleContext";
import SessionIntro from "@components/shell/sessionIntro";
import NavBar from "@components/shell/navBar";
import Footer from "@components/shell/footer";

export const metadata = {
  title: "Fernando Carvalho Portfolio",
  description:
    "Software engineer focused on React/Next.js product interfaces, API integration and spec-driven AI workflows.",
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="theme-color" content="#000000" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="icon"
          href="/favicon.ico"
          type="image/x-icon"
          sizes="1563x1563"
        />
      </head>
      <body className={styles.body}>
        <SessionIntro />
        <LocaleProvider locale={locale}>
          <NextIntlClientProvider messages={messages}>
            <div className={styles.shellLayer}>
              <NavBar />
            </div>
            <main className={styles.main}>{children}</main>
            <div className={styles.shellLayer}>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
