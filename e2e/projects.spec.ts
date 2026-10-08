import { test, expect } from "./fixtures";
import { NavBar } from "./pages/nav-bar";
import { ProjectsPage } from "./pages/projects-page";
import { readFileSync } from "node:fs";

const COPY = Object.fromEntries(
  ["en", "pt", "es"].map((locale) => [
    locale,
    JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8")) as Record<string, string>,
  ]),
);

test.describe("projects", () => {
  for (const locale of ["en", "pt", "es"] as const) {
    const copy = COPY[locale];

    test(`renders localized project content and metadata (${locale})`, async ({ page }) => {
      const projects = new ProjectsPage(page);
      await projects.goto(locale);

      await expect(projects.title).toHaveText(copy.PROJECTS);
      await expect(projects.card).toBeVisible();
      await expect(page.getByRole("article")).toHaveCount(1);
      await expect(projects.card).toContainText(copy.PROJECT_NUTRIBUILDER_DESCRIPTION);
      await expect(projects.card.getByRole("heading", { level: 3 })).toHaveText("NutriBuilder");
      await expect(projects.image).toHaveAttribute("alt", copy.PROJECT_NUTRIBUILDER_IMAGE_ALT);
      await expect.poll(() => projects.image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
      await expect(projects.image).toHaveAttribute("src", /projects%2Fnutribuilder\.webp/);
      await expect(projects.visitLink).toHaveText(copy.PROJECT_NUTRIBUILDER_VISIT);
      await expect(projects.visitLink).toHaveAttribute("href", "https://nutribuilder.com.br/");
      await expect(projects.visitLink).toHaveAttribute("target", "_blank");
      await expect(projects.visitLink).toHaveAttribute("rel", "noopener noreferrer");
      await expect(projects.card.locator("time")).toHaveAttribute("datetime", "2026-10-07");
      await expect(page.getByRole("main")).not.toContainText(/volpie/i);
      await expect(page).toHaveTitle(`${copy.PROJECTS} | Fernando Carvalho`);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", copy.PROJECT_NUTRIBUILDER_DESCRIPTION);
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });

    test(`navigates from About to Projects after the About item (${locale})`, async ({ page, viewport }) => {
      const nav = new NavBar(page);
      await page.goto(`/${locale}/about`);
      if ((viewport?.width ?? 0) < 640) await nav.hamburger.click();

      const links = nav.navigation.getByRole("link");
      await expect(links).toHaveText([copy.HOME, copy.ABOUT, copy.PROJECTS]);
      await nav.link(copy.PROJECTS).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/projects$`));
      await expect(new ProjectsPage(page).title).toHaveText(copy.PROJECTS);
      if ((viewport?.width ?? 0) < 640) await expect(nav.navigation).toHaveCount(0);
    });
  }

  test("switches locales while staying on Projects", async ({ page }) => {
    const nav = new NavBar(page);
    const projects = new ProjectsPage(page);
    await projects.goto("en");
    for (const locale of ["pt", "es", "en"] as const) {
      await nav.selectLocale(locale);
      await expect(page).toHaveURL(new RegExp(`/${locale}/projects$`));
      await expect(projects.title).toHaveText(COPY[locale].PROJECTS);
    }
  });

  for (const gutter of [0, 15]) {
    test(`keeps the desktop nav and locale selector separate at narrow widths (${gutter}px scrollbar)`, async ({ page, isMobile }) => {
      // Mobile Chromium uses overlay scrollbars and ignores reserved gutters.
      test.skip(gutter === 15 && isMobile, "Classic scrollbar gutters apply to desktop browsers");
      test.setTimeout(60_000);
      const nav = new NavBar(page);
      for (const locale of ["en", "pt", "es"] as const) {
        await page.setViewportSize({ width: 640, height: 480 });
        await new ProjectsPage(page).goto(locale);
        // A reserved 15px gutter matches classic scrollbars without depending on
        // the host OS preference or Chromium's overlay-scrollbar mode.
        await page.addStyleTag({ content: `
          html { overflow-y: scroll !important; scrollbar-gutter: ${gutter ? "stable" : "auto"} !important; }
          html::-webkit-scrollbar { width: ${gutter}px; }
        ` });
        for (const width of [640, 645, 651, 652, 660, 680, 720, 862, 863, 880, 900, 960, 961, 1024]) {
          await page.setViewportSize({ width, height: 480 });
          await expect.poll(() => page.evaluate(() => innerWidth - document.documentElement.getBoundingClientRect().width)).toBe(gutter);
          await expect(nav.link(COPY[locale].PROJECTS)).toBeVisible();
          await expect(nav.languageSelect).toBeVisible();
          await page.evaluate(() => document.fonts.ready);
          await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
          const navigation = await nav.navigation.boundingBox();
          const selector = await nav.languageSelect.boundingBox();
          expect(navigation).not.toBeNull();
          expect(selector).not.toBeNull();
          expect(
            selector!.x - (navigation!.x + navigation!.width),
            `${locale} at ${width}px: nav-to-selector gap`,
          ).toBeGreaterThanOrEqual(16);
          const lastItem = await nav.navigation.locator("li").last().boundingBox();
          expect(lastItem).not.toBeNull();
          expect(
            selector!.x - (lastItem!.x + lastItem!.width),
            `${locale} at ${width}px: last nav item-to-selector gap`,
          ).toBeGreaterThanOrEqual(16);
        }
      }
    });
  }
});
