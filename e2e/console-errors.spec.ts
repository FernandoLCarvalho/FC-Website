import { test, expect } from "./fixtures";

const PAGES = ["/en", "/pt", "/es", "/en/about", "/pt/about", "/es/about"];

test.describe("console health", () => {
  // Real scene on purpose: this is the one place we check that the actual model loads cleanly.
  test.use({ stubStarModel: false });

  for (const path of PAGES) {
    test(`no console errors on ${path}`, async ({ page, consoleErrors }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      expect(consoleErrors).toEqual([]);
    });
  }
});
