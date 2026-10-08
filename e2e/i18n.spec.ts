import { test, expect } from "./fixtures";
import { HomePage } from "./pages/home-page";
import { NavBar, type LocaleCode } from "./pages/nav-bar";

const HOME_ROLE: Record<LocaleCode, string> = {
  en: "Software Engineer · Full-stack with .NET, React and Azure",
  pt: "Software Engineer · Full-stack com .NET, React e Azure",
  es: "Software Engineer · Full-stack con .NET, React y Azure",
};

test.describe("i18n", () => {
  test("bare / redirects to the default locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  for (const locale of ["en", "pt", "es"] as const) {
    test(`language select and native options retain normal font size in ${locale}`, async ({ page }) => {
      const nav = new NavBar(page);
      await page.goto(`/${locale}/projects`);

      // Check the select too: macOS/WebKit native popups use its font size,
      // and option-only styling cannot protect that rendering path.
      await expect(nav.languageSelect).toHaveCSS("font-size", "14px");
      const options = nav.languageSelect.locator("option");
      await expect(options).toHaveCount(3);
      for (const option of await options.all()) {
        await expect(option).toHaveCSS("font-size", "14px");
      }
    });

    test(`direct visit to /${locale}`, async ({ page }) => {
      const nav = new NavBar(page);
      await page.goto(`/${locale}`);

      await expect(page).toHaveURL(new RegExp(`/${locale}$`));
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByText(HOME_ROLE[locale])).toBeVisible();
      await expect(nav.languageSelect).toHaveValue(locale);
    });
  }

  test("switching language updates the URL prefix and the texts", async ({
    page,
  }) => {
    const home = new HomePage(page);
    const nav = new NavBar(page);
    await home.goto("en");

    for (const locale of ["pt", "es", "en"] as const) {
      await nav.selectLocale(locale);
      await expect(page).toHaveURL(new RegExp(`/${locale}$`));
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByText(HOME_ROLE[locale])).toBeVisible();
    }
  });

  test("switching language on /about stays on the about page", async ({
    page,
  }) => {
    const nav = new NavBar(page);
    await page.goto("/en/about");

    await nav.selectLocale("pt");
    await expect(page).toHaveURL(/\/pt\/about$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Sobre mim" }),
    ).toBeVisible();
  });
});
