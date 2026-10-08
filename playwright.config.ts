import { defineConfig, devices } from "@playwright/test";

// Dedicated port: 3001 is the dev server's port and is often taken by other local tools,
// and reusing a dev server would make the visual baselines differ from the production build.
const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = `http://127.0.0.1:${PORT}`;
// macOS native select popups are oversized/displaced when headed Chromium
// emulates DPR 1 on a Retina display. Keep this separate from visual baselines.
const HEADED = process.env.HEADED === "1";
const baselineProjects = [
  {
    name: "desktop",
    use: {
      ...devices["Desktop Chrome"],
      viewport: { width: 1440, height: 900 },
    },
  },
  { name: "mobile", use: { ...devices["Pixel 7"] } },
  { name: "mobile-landscape", use: { ...devices["Pixel 7 landscape"] } },
];
const functionalProjects = baselineProjects.map((project) => ({
  ...project,
  name: `${project.name}-functional`,
  testIgnore: "**/visual.spec.ts",
}));

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  workers: HEADED ? 1 : undefined,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixels: 100,
    },
  },
  use: {
    baseURL: BASE_URL,
    reducedMotion: "reduce",
    trace: "on-first-retry",
  },
  projects: HEADED ? [
    {
      name: "desktop-headed",
      testIgnore: "**/visual.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
        headless: false,
      },
    },
  ] : [
    ...functionalProjects,
    // Keep visual project names/device settings (and therefore baseline paths)
    // unchanged. The suite script runs visuals separately even if functionals fail;
    // this chain serializes viewport captures when Playwright is called directly.
    ...baselineProjects.map((project, index) => ({
      ...project,
      testMatch: "**/visual.spec.ts",
      fullyParallel: false,
      workers: 1,
      dependencies: index === 0 ? [] : [baselineProjects[index - 1].name],
    })),
  ],
  webServer: {
    command: `npm run build && npx next start -H 127.0.0.1 -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !!process.env.E2E_REUSE_SERVER,
    timeout: 300_000,
    env: {
      // Pin the env-driven UI so the suite and the visual baselines are deterministic:
      // WhatsApp enabled (fake number) and no Google Maps key (about page shows the text fallback).
      NEXT_PUBLIC_PHONE_NUMBER: "5562999999999",
      NEXT_PUBLIC_API_KEY: "",
    },
  },
});
