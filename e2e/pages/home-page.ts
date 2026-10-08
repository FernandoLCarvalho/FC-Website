import type { Locator, Page } from "@playwright/test";
import type { LocaleCode } from "./nav-bar";

export class HomePage {
  readonly heading: Locator;
  readonly canvas: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole("heading", { level: 1 });
    this.canvas = page.locator("canvas");
  }

  async goto(locale: LocaleCode = "en") {
    await this.page.goto(`/${locale}`);
  }

  contactButton(name: string | RegExp) {
    return this.page.getByRole("button", { name });
  }
}
