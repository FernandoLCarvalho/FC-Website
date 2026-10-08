import type { Locator, Page } from "@playwright/test";

export type LocaleCode = "en" | "pt" | "es";

/**
 * The header renders both a desktop nav (>= 640px) and a mobile menu (hamburger).
 * Only one of them is visible at any viewport, and Playwright's role queries skip
 * hidden elements, so `navigation` always resolves to the one the user can see.
 */
export class NavBar {
  readonly header: Locator;
  readonly navigation: Locator;
  readonly languageSelect: Locator;
  readonly hamburger: Locator;
  readonly closeButton: Locator;
  readonly creditsCloseButton: Locator;
  readonly creditsPanel: Locator;

  constructor(private readonly page: Page) {
    this.header = page.getByRole("banner");
    this.navigation = this.header.getByRole("navigation");
    this.languageSelect = this.header.getByRole("combobox");
    this.hamburger = this.header.getByRole("button", {
      name: /^(Open menu|Abrir menu|Abrir menú)$/,
    });
    this.closeButton = this.header.getByRole("button", {
      name: /^(Close menu|Fechar menu|Cerrar menú)$/,
    });
    this.creditsCloseButton = this.header.getByRole("button", {
      name: /^(Close credits|Fechar créditos|Cerrar créditos)$/,
    });
    this.creditsPanel = this.header.getByRole("region", {
      name: "Scene Landpage",
    });
  }

  link(name: string | RegExp) {
    return this.navigation.getByRole("link", { name });
  }

  button(name: string | RegExp) {
    return this.navigation.getByRole("button", { name });
  }

  async selectLocale(locale: LocaleCode) {
    await this.languageSelect.selectOption(locale);
    await this.page.waitForURL(new RegExp(`/${locale}(/|$)`));
  }
}
