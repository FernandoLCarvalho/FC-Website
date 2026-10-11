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

// Keep the server HTML and blocking head script, but prevent React from hydrating.
// These checks catch flashes that post-hydration visibility assertions cannot.
for (const path of ["/", "/pt", "/en", "/es"]) {
  test(`fresh intro covers the page before hydration on ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.route("**/_next/**/*.js*", (route) => route.abort());
    await page.goto(path);
    const overlay = page.getByText("Portfolio", { exact: true }).locator("../..");
    await expect(overlay).toBeVisible();
    await expect(overlay).toHaveCSS("opacity", "1");
    await expect(overlay).toHaveCSS("background-color", "rgb(0, 0, 0)");
    expect(await overlay.boundingBox()).toEqual({
      x: 0,
      y: 0,
      ...page.viewportSize(),
    });
    expect(await overlay.evaluate((element) =>
      [[0.1, 0.1], [0.5, 0.5], [0.9, 0.9]].every(([x, y]) =>
        element.contains(document.elementFromPoint(innerWidth * x, innerHeight * y)),
      ),
    )).toBe(true);
  });
}

test("returning session hides the server overlay before hydration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => sessionStorage.setItem("fc_intro_seen", "1"));
  await page.route("**/_next/**/*.js*", (route) => route.abort());
  await page.goto("/pt");
  await expect(page.locator("html")).toHaveAttribute("data-intro-seen", "");
  const portfolio = page.getByText("Portfolio", { exact: true });
  await expect(portfolio).toHaveCount(1);
  await expect(portfolio).toBeHidden();
});

test("reduced motion hides the server overlay before hydration", async ({ page }) => {
  await page.route("**/_next/**/*.js*", (route) => route.abort());
  await page.goto("/pt");
  const portfolio = page.getByText("Portfolio", { exact: true });
  await expect(portfolio).toHaveCount(1);
  await expect(portfolio).toBeHidden();
});

test("disabled JavaScript leaves the page usable immediately", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "no-preference",
    viewport: { width: 1440, height: 900 },
  });
  try {
    const page = await context.newPage();
    await page.goto("/en");
    await expect(page.locator("[data-intro-overlay]")).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("link", { name: "About me" }).click();
    await expect(page).toHaveURL(/\/en\/about$/);
  } finally {
    await context.close();
  }
});

test("failed application chunks release the overlay after six seconds", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/_next/static/chunks/**", (route) => route.abort());
  await page.goto("/en");
  const overlay = page.locator("[data-intro-overlay]");
  await expect(overlay).toBeVisible();
  await expect(overlay).toBeHidden({ timeout: 6500 });
  await expect(overlay).toHaveCSS("pointer-events", "none");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "About me" }).click();
  await expect(page).toHaveURL(/\/en\/about$/);
});

test("fresh intro preserves bold brand text, finishes, and does not repeat", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    // Existing Three.js dependency warning is unrelated to React hydration.
    if (
      message.type() === "warning" &&
      message.text() === "THREE.Clock: This module has been deprecated. Please use THREE.Timer instead."
    ) return;
    if (
      message.type() === "warning" &&
      /^\[\.WebGL-.*GPU stall due to ReadPixels/.test(message.text())
    ) return;
    if (["warning", "error"].includes(message.type())) errors.push(message.text());
  });
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
  expect(errors).toEqual([]);
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
