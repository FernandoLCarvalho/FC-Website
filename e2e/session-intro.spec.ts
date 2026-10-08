import { test, expect } from "@playwright/test";

// Use the unmodified Playwright page: normal fixtures deliberately mark the intro as seen.
test.beforeEach(async ({ page }) => {
  await page.route("**/glb/*.glb", (route) =>
    route.fulfill({
      contentType: "model/gltf+json",
      body: JSON.stringify({
        asset: { version: "2.0" },
        scene: 0,
        scenes: [{ nodes: [] }],
      }),
    }),
  );
});

test("fresh intro preserves bold brand text, finishes, and does not repeat", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  const brand = page.getByText("Fernando Carvalho", { exact: true });
  await expect(brand).toBeVisible();
  await expect(brand).toHaveCSS("font-weight", "700");
  await expect(
    page.getByRole("heading", { level: 1, includeHidden: true }),
  ).toHaveCount(1);
  await expect(brand).toHaveCount(0, { timeout: 6500 });
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Portfolio", { exact: true })).toHaveCount(0);
});

test("denied session storage cannot trap the intro or throw", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    });
  });
  await page.goto("/en");
  await expect(page.getByText("Portfolio", { exact: true })).toBeVisible();
  await expect(page.getByText("Portfolio", { exact: true })).toHaveCount(0, {
    timeout: 6500,
  });
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
  expect(errors).toEqual([]);
});

test("reduced motion skips the intro and continuous name animation", async ({
  page,
}) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("Portfolio", { exact: true })).toHaveCount(0);
  const animationNames = await page
    .getByRole("heading", { level: 1 })
    .locator("span span")
    .evaluateAll((letters) =>
      letters.map((letter) => getComputedStyle(letter).animationName),
    );
  expect(animationNames.length).toBeGreaterThan(0);
  expect(animationNames.every((name) => name === "none")).toBe(true);
});
