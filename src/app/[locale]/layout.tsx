import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import "../../styles/globals.css";
import styles from "./layout.module.css";

import { LocaleProvider } from "@/context/LocaleContext";
import SessionIntro from "@components/shell/sessionIntro";
import NavBar from "@components/shell/navBar";
import Footer from "@components/shell/footer";

type Locale = "en" | "es" | "pt";

export const metadata = {
  title: "Fernando Carvalho Portfolio",
  description:
    "Building efficient and scalable web solutions for the digital world.",
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
  params: asyncParams,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await asyncParams;

  if (!routing.locales.includes(locale as Locale)) {
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
        <LocaleProvider>
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
