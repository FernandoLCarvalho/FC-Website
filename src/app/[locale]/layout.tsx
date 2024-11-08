import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing'
import { Inter } from "next/font/google";
import "../globals.css";
import NavBar from './components/navBar';


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My Website",
  description: "Building efficient and scalable web solutions for the digital world.",
  icons: {
    icon: '/favicon.ico',
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
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className='absolute w-full' style={{zIndex: '1'}}>
            <NavBar />
          </div>
          <main style={{zIndex: '0'}}
            className="relative"
          >{children}</main>

        </NextIntlClientProvider>
      </body>
    </html>
  );
}