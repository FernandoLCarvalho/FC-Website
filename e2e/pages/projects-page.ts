import type { Page } from "@playwright/test";
import type { LocaleCode } from "./nav-bar";

export class ProjectsPage {
  readonly title;
  readonly card;
  readonly image;
  readonly visitLink;

  constructor(private readonly page: Page) {
    this.title = page.getByRole("heading", { level: 1 });
    this.card = page.getByRole("article", { name: "NutriBuilder" });
    this.image = this.card.getByRole("img", { name: /NutriBuilder/ });
    this.visitLink = this.card.getByRole("link");
  }

  async goto(locale: LocaleCode) {
    await this.page.goto(`/${locale}/projects`);
  }
}
