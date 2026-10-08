import { test, expect } from "./fixtures";
import { professionalCompetencies } from "../src/constants/technologies";

test.describe("about", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/about");
  });

  test("renders the title and avatar", async ({ page }) => {
    await expect(
      page.getByRole("heading", { level: 1, name: "About me" }),
    ).toBeVisible();

    const avatar = page.getByRole("img", { name: "Fernando Carvalho" });
    await expect(avatar).toBeVisible();
    await expect
      .poll(() => avatar.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);
  });

  test("renders one card per competency from the constants", async ({
    page,
  }) => {
    const cards = page.getByRole("article");
    await expect(cards).toHaveCount(professionalCompetencies.length);

    for (const competency of professionalCompetencies) {
      const card = cards.filter({
        has: page.getByRole("list").filter({ hasText: competency.tools[0] }),
      });
      await expect(card).toHaveCount(1);
      for (const tool of competency.tools) {
        await expect(card.getByRole("listitem").filter({ hasText: tool }).first()).toBeVisible();
      }
    }
  });

  test("shows the location fallback when no Maps key is configured", async ({
    page,
  }) => {
    await expect(
      page.getByText("Approximate location: Goiânia, Brazil."),
    ).toBeVisible();
    await expect(page.locator("iframe")).toHaveCount(0);
  });
});
