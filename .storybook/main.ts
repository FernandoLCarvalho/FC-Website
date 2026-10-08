import type { StorybookConfig } from "@storybook/nextjs-vite";
import { mergeConfig } from "vite";
import { fileURLToPath } from "node:url";

const config: StorybookConfig = {
  core: { disableTelemetry: true },
  stories: [
    "./docs/*.stories.@(ts|tsx)",
    "../src/components/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      resolve: {
        alias: [
          {
            // `parameters.nextjs.appDirectory` crashes every story with Next 16
            // (the router mock lacks LayoutRouterContext.parentRenderTree), so
            // next-intl's navigation helpers are replaced by a story-controlled mock.
            find: /^@\/i18n\/routing$/,
            replacement: fileURLToPath(
              new URL("./mocks/i18nRouting.tsx", import.meta.url),
            ),
          },
        ],
      },
    }),
};

export default config;
