import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing'
import "../globals.css";
import NavBar from './components/navBar';
import Footer from './components/Footer';
import Head from 'next/head';

type Locale = 'en' | 'es' | 'pt';

export const metadata = {
  title: "My Website",
  description: "Building efficient and scalable web solutions for the digital world.",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#000000",
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
  params: asyncParams
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {

  const { locale } = await asyncParams;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
       <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; img-src *; media-src *; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self';" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className='absolute w-full' style={{ zIndex: '1' }}>
            <NavBar />
          </div>
          <main style={{ zIndex: '0' }}
            className="relative"
          >{children}
          </main>
          <div className='absolute w-full' style={{ zIndex: '1', bottom: '0' }}>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}