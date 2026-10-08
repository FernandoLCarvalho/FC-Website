import { test, expect } from "./fixtures";
import { NavBar } from "./pages/nav-bar";

const DESKTOP_NAV_MIN_WIDTH = 640;
const SKETCHFAB_URL =
  "https://sketchfab.com/3d-models/star-cluster-15k-stars-model-51148b78a37a4a72b22d8e06f4293e07";

test.describe("footer", () => {
  test("shows the copyright with the current year", async ({ page }) => {
    await page.goto("/en");
    const footer = page.getByRole("contentinfo");

    await expect(footer).toContainText("Fernando L. Carvalho");
    await expect(footer).toContainText(/© \d{4}/);
  });
});

test.describe("asset credits", () => {
  test.beforeEach(async ({ page, viewport }) => {
    await page.goto("/en");
    const nav = new NavBar(page);
    if ((viewport?.width ?? 0) < DESKTOP_NAV_MIN_WIDTH) {
      await nav.hamburger.click();
    }
  });

  test("opens from the nav, shows attribution and closes with ×", async ({
    page,
  }) => {
    const nav = new NavBar(page);
    await expect(nav.creditsPanel).toBeHidden();

    await nav.button("Credits").click();
    await expect(nav.creditsPanel).toBeVisible();
    await expect(nav.creditsPanel).toContainText("License: CC Attribution");
    await expect(nav.creditsPanel).toContainText("Author: Sebastian Sosnowski");
    await expect(
      nav.creditsPanel.getByRole("link", { name: "Sketchfab" }),
    ).toHaveAttribute("href", SKETCHFAB_URL);
    await expect(
      nav.creditsPanel.getByRole("link", { name: "Sketchfab" }),
    ).toHaveAttribute("target", "_blank");
    await expect(
      nav.creditsPanel.getByRole("link", { name: "Sketchfab" }),
    ).toHaveAttribute("rel", /noopener/);
    await expect(
      nav.creditsPanel.getByText(
        "This website is built with Next.js, CSS Modules and React Three Fiber",
      ),
    ).toBeVisible();

    await nav.creditsCloseButton.click();
    await expect(nav.creditsPanel).toBeHidden();
  });

  test("closes when clicking outside the panel", async ({ page, isMobile, viewport }) => {
    const nav = new NavBar(page);
    await nav.button("Credits").click();
    await expect(nav.creditsPanel).toBeVisible();

    // Landscape touch passes through the scene to the hero for page scrolling.
    // Keep an actionable DOM target while the responsive layout settles.
    const landscapeScroll = isMobile && (viewport?.height ?? 900) <= 560;
    await page.locator(landscapeScroll ? "main section" : "canvas")
      .click({ position: { x: 5, y: 5 } });
    await expect(nav.creditsPanel).toBeHidden();
  });
});
