import type { Decorator, Preview } from "@storybook/nextjs-vite";
import { useEffect, type ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

import "../src/styles/globals.css";

import en from "../messages/en.json";
import es from "../messages/es.json";
import pt from "../messages/pt.json";
import { MockRoutingContext } from "./mocks/i18nRouting";

const messagesByLocale = { en, pt, es } as const;
type StoryLocale = keyof typeof messagesByLocale;

const withIntl: Decorator = (Story, context) => {
  const locale = (context.globals.locale as StoryLocale) ?? "en";

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messagesByLocale[locale]}
      timeZone="America/Sao_Paulo"
    >
      <Story />
    </NextIntlClientProvider>
  );
};

const withRouting: Decorator = (Story, context) => (
  <MockRoutingContext.Provider
    value={{ pathname: context.parameters.pathname ?? "/" }}
  >
    <Story />
  </MockRoutingContext.Provider>
);

// NavBar writes --nav-h on <html>; drop it so it does not leak into other stories.
function NavHeightReset({ children }: { children: ReactNode }) {
  useEffect(
    () => () => {
      document.documentElement.style.removeProperty("--nav-h");
    },
    [],
  );

  return children;
}

const withNavHeightReset: Decorator = (Story) => (
  <NavHeightReset>
    <Story />
  </NavHeightReset>
);

const preview: Preview = {
  decorators: [withNavHeightReset, withRouting, withIntl],
  globalTypes: {
    locale: {
      description: "Site locale",
      toolbar: {
        title: "Locale",
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "pt", title: "Português (BR)" },
          { value: "es", title: "Español" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: "centered",
    backgrounds: {
      options: {
        dark: { name: "Site dark", value: "#0a0a0a" },
        light: { name: "Light", value: "#ffffff" },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  initialGlobals: {
    locale: "en",
    backgrounds: { value: "dark" },
  },
};

export default preview;
