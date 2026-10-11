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

for (const hydrationDelay of [3000, 7000]) {
  test(`hydration delayed ${hydrationDelay}ms keeps overlay and interactivity coordinated`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    let releaseChunks!: () => void;
    const chunksReady = new Promise<void>((resolve) => { releaseChunks = resolve; });
    await page.route("**/_next/static/chunks/**", async (route) => {
      // CSS also lives under chunks; keep it available for the SSR first paint.
      if (route.request().resourceType() === "script") await chunksReady;
      await route.continue();
    });
    await page.addInitScript(() => {
      const samples: { time: number; shown: boolean; inert: boolean }[] = [];
      Object.assign(window, { introFrames: samples });
      const sample = () => {
        const overlay = document.querySelector("[data-intro-overlay]");
        const style = overlay && getComputedStyle(overlay);
        samples.push({
          time: performance.now(),
          shown: !!style && style.display !== "none" && style.visibility !== "hidden",
          inert: document.querySelector("main")?.inert ?? false,
        });
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });

    try {
      await page.goto("/en", { waitUntil: "commit" });
      const overlay = page.locator("[data-intro-overlay]");
      const main = page.locator("main");
      await expect(overlay).toBeVisible();
      await page.waitForFunction((delay) => performance.now() >= delay, hydrationDelay);
      if (hydrationDelay > 6000) {
        await expect(overlay).toBeHidden();
        await expect(main).not.toHaveAttribute("inert", "");
      }
      const releasedAt = await page.evaluate(() => performance.now());
      releaseChunks();

      if (hydrationDelay < 6000) {
        await expect(main).toHaveAttribute("inert", "");
        await page.waitForFunction(() => performance.now() >= 6250);
        await expect(overlay).toBeVisible();
        await expect(main).toHaveAttribute("inert", "");
        await expect(overlay).toHaveCount(0, { timeout: 6500 });
        expect(await page.evaluate(() => performance.now()) - releasedAt).toBeGreaterThanOrEqual(4500);
      } else {
        // Completion proves hydration ran; CSS hiding alone is not sufficient.
        await expect(overlay).toHaveCount(0, { timeout: 3000 });
      }
      await expect(main).not.toHaveAttribute("inert", "");
      expect(await page.evaluate(() => sessionStorage.getItem("fc_intro_seen"))).toBe("1");
      const frames = await page.evaluate(() => (
        window as unknown as {
          introFrames: { time: number; shown: boolean; inert: boolean }[];
        }
      ).introFrames);
      expect(frames.filter((frame) => frame.inert && !frame.shown)).toEqual([]);
      if (hydrationDelay > 6000) {
        const afterHydration = frames.filter((frame) => frame.time >= releasedAt);
        expect(afterHydration.length).toBeGreaterThan(0);
        expect(afterHydration.some((frame) => frame.shown || frame.inert)).toBe(false);
      }
      const menu = page.getByRole("button", { name: "Open menu" });
      if (await menu.isVisible()) await menu.click();
      await page.getByRole("link", { name: "About me" }).click();
      await expect(page).toHaveURL(/\/en\/about$/);
    } finally {
      releaseChunks();
    }
  });
}

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
