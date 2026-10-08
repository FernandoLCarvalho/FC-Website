import { test, expect } from "./fixtures";
import type { Page } from "@playwright/test";

/**
 * Visual baselines of the CURRENT UI. They guard the upcoming 1:1 refactor and lib upgrade.
 * Stability measures: reducedMotion + animations "disabled" (see playwright.config.ts),
 * session intro skipped (see fixtures.ts), WebGL canvas removed from rendering, footer year masked.
 *
 * The star scene redraws every frame; under headless software GL that starves the main thread
 * and screenshots never settle. The model is stubbed with an empty glTF (see fixtures.ts) and the
 * canvas is hidden; its wrapper is absolutely positioned, so no other element moves.
 */
const HIDE_WEBGL_CANVAS = "canvas { display: none !important; }";
const LOCALES = ["en", "pt", "es"] as const;
const PAGES = [
  { name: "home", path: "" },
  { name: "about", path: "/about" },
  { name: "projects", path: "/projects" },
] as const;

async function waitForStablePage(page: Page) {
  await page.waitForLoadState("networkidle");
  // Persistent (not the per-screenshot `style` option): toggling it on every attempt makes
  // R3F resize and re-render, so the screenshot never settles.
  await page.addStyleTag({ content: HIDE_WEBGL_CANVAS });
  await page.evaluate(() => document.fonts.ready);
}

function dynamicRegions(page: Page) {
  return [page.getByRole("contentinfo")];
}

test.describe("visual baseline", () => {
  for (const locale of LOCALES) {
    for (const { name, path } of PAGES) {
      test(`${name} (${locale})`, async ({ page }) => {
        await page.goto(`/${locale}${path}`);
        await waitForStablePage(page);

        await expect(page).toHaveScreenshot(`${name}-${locale}.png`, {
          fullPage: true,
          mask: dynamicRegions(page),
        });
      });
    }
  }

  test("asset credits panel (en)", async ({ page, viewport }) => {
    await page.goto("/en");
    await waitForStablePage(page);

    if ((viewport?.width ?? 0) < 640) {
      await page.getByRole("button", { name: "Open menu" }).click();
    }
    await page
      .getByRole("banner")
      .getByRole("button", { name: "Credits" })
      .click();
    await expect(
      page.getByRole("region", { name: "Scene Landpage" }),
    ).toBeVisible();

    await expect(page).toHaveScreenshot("credits-en.png", {
      mask: dynamicRegions(page),
    });
  });

  test("mobile menu open (en)", async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) >= 640, "hamburger only below 640px");
    await page.goto("/en");
    await waitForStablePage(page);

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("link", { name: "About me" })).toBeVisible();

    await expect(page).toHaveScreenshot("mobile-menu-en.png", {
      mask: dynamicRegions(page),
    });
  });
});
