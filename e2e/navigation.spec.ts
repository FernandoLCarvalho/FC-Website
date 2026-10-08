import { test, expect } from "./fixtures";
import { NavBar } from "./pages/nav-bar";

const DESKTOP_NAV_MIN_WIDTH = 640;

test.describe("desktop navigation", () => {
  test.beforeEach(({ viewport }) => {
    test.skip(
      (viewport?.width ?? 0) < DESKTOP_NAV_MIN_WIDTH,
      "desktop nav is hidden below 640px",
    );
  });

  test("navigates home -> about -> home", async ({ page }) => {
    const nav = new NavBar(page);
    await page.goto("/en");

    await nav.link("About me").click();
    await expect(page).toHaveURL(/\/en\/about$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "About me" }),
    ).toBeVisible();

    await nav.link("Home").click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "Fernando Carvalho",
    );
  });

  test("keeps the active locale while navigating", async ({ page }) => {
    const nav = new NavBar(page);
    await page.goto("/pt");

    await nav.link("Sobre mim").click();
    await expect(page).toHaveURL(/\/pt\/about$/);

    await nav.link("Página Inicial").click();
    await expect(page).toHaveURL(/\/pt$/);
    await expect(nav.languageSelect).toHaveValue("pt");
  });
});

test.describe("mobile navigation", () => {
  test.beforeEach(({ viewport }) => {
    test.skip(
      (viewport?.width ?? 0) >= DESKTOP_NAV_MIN_WIDTH,
      "hamburger only exists below 640px",
    );
  });

  test("hamburger is shown instead of the desktop nav", async ({ page }) => {
    const nav = new NavBar(page);
    await page.goto("/en");

    await expect(nav.hamburger).toBeVisible();
    await expect(nav.navigation).toHaveCount(0);
  });

  test("opens and closes with the close button", async ({ page }) => {
    const nav = new NavBar(page);
    await page.goto("/en");

    await nav.hamburger.click();
    await expect(nav.link("About me")).toBeVisible();

    await nav.closeButton.click();
    await expect(nav.navigation).toHaveCount(0);
  });

  test("navigates to about and closes the menu", async ({ page }) => {
    const nav = new NavBar(page);
    await page.goto("/en");

    await nav.hamburger.click();
    await nav.link("About me").click();

    await expect(page).toHaveURL(/\/en\/about$/);
    await expect(nav.navigation).toHaveCount(0);
  });

  test("keeps the active locale while navigating", async ({ page }) => {
    const nav = new NavBar(page);
    await page.goto("/es");

    await nav.hamburger.click();
    await nav.link("Sobre mí").click();
    await expect(page).toHaveURL(/\/es\/about$/);

    await nav.hamburger.click();
    await nav.link("Página de Inicio").click();
    await expect(page).toHaveURL(/\/es$/);
  });
});
