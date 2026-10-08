import { test, expect } from "./fixtures";
import { NavBar } from "./pages/nav-bar";

const LABELS = {
  en: { language: "Select Language", open: "Open menu" },
  pt: { language: "Selecione a língua", open: "Abrir menu" },
  es: { language: "Seleccione idioma", open: "Abrir menú" },
} as const;

test("language and menu controls have localized names; viewport allows zoom", async ({
  page,
  viewport,
}) => {
  for (const locale of ["en", "pt", "es"] as const) {
    await page.goto(`/${locale}/about`);
    const nav = new NavBar(page);
    await expect(nav.languageSelect).toHaveAccessibleName(
      LABELS[locale].language,
    );
    if ((viewport?.width ?? 0) < 640) {
      await expect(nav.hamburger).toHaveAccessibleName(LABELS[locale].open);
    }
    const viewportTags = page.locator('meta[name="viewport"]');
    await expect(viewportTags).toHaveCount(1);
    await expect(viewportTags).not.toHaveAttribute(
      "content",
      /maximum-scale|user-scalable=no/,
    );
  }
});

test("mobile drawer contains keyboard focus, closes on Escape, and restores interaction", async ({
  page,
  viewport,
}) => {
  test.skip((viewport?.width ?? 0) >= 640, "drawer only below 640px");
  await page.goto("/en/about");
  const nav = new NavBar(page);
  await nav.hamburger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(dialog).toBeFocused();
  await expect(nav.hamburger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Shift+Tab");
  await expect(nav.button("Credits")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(nav.closeButton).toBeFocused();
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(nav.hamburger).toBeFocused();
  await expect(nav.hamburger).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
  await nav.languageSelect.selectOption("pt");
  await expect(page).toHaveURL(/\/pt\/about$/);
});

test("credits can be reached by keyboard after the drawer closes and Escape returns focus", async ({
  page,
  viewport,
}) => {
  await page.goto("/en/about");
  const nav = new NavBar(page);
  const mobile = (viewport?.width ?? 0) < 640;
  if (mobile) await nav.hamburger.click();
  await nav.button("Credits").click();
  await expect(nav.creditsPanel).toBeVisible();
  await nav.creditsCloseButton.focus();
  await expect(nav.creditsCloseButton).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(nav.creditsPanel).toBeHidden();
  await expect(mobile ? nav.hamburger : nav.button("Credits")).toBeFocused();
});

test("locale changes retain the query and hash", async ({ page }) => {
  await page.goto("/en/about?source=portfolio#profile");
  await new NavBar(page).selectLocale("pt");
  await expect(page).toHaveURL(/\/pt\/about\?source=portfolio#profile$/);
});

test("contact wheel forwarding cancels once without passive-listener errors", async ({
  page,
  consoleErrors,
  isMobile,
  viewport,
}) => {
  await page.goto("/en");
  await expect(page.locator("canvas")).toBeVisible();
  const canceled = await page
    .getByRole("button", { name: "GitHub" })
    .evaluate((button) => {
      const event = new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        deltaY: 40,
      });
      button.dispatchEvent(event);
      return event.defaultPrevented;
    });
  const landscapePageScroll = isMobile && (viewport?.height ?? 900) <= 560;
  expect(canceled).toBe(!landscapePageScroll);
  expect(consoleErrors).toEqual([]);
});
