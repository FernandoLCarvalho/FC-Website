import { test, expect, type Page } from "@playwright/test";

async function expectBackgroundFocusable(page: Page) {
  for (const selector of ["main", "header", "footer"]) {
    await expect(page.locator(selector)).toHaveCSS("visibility", "visible");
  }
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() =>
    !!document.activeElement?.closest("main, header, footer"),
  )).toBe(true);
}

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
  await expectBackgroundFocusable(page);
});

test("pre-hydration accessibility tree excludes the background and decorative intro", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/_next/**/*.js*", (route) => route.abort());
  await page.goto("/en");
  await expect(page.locator("[data-intro-overlay]")).toBeVisible();
  const cdp = await page.context().newCDPSession(page);
  try {
    const { nodes } = await cdp.send("Accessibility.getFullAXTree");
    const exposed = nodes.filter((node) => !node.ignored);
    expect(exposed.some((node) =>
      ["link", "button", "heading", "banner", "main", "contentinfo", "StaticText"].includes(String(node.role?.value)),
    )).toBe(false);
    await expect(page.locator("[data-intro-overlay] a, [data-intro-overlay] button, [data-intro-overlay] [tabindex]")).toHaveCount(0);
  } finally {
    await cdp.detach();
  }
});

test("returning session never hides the shell through hydration and locale navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    sessionStorage.setItem("fc_intro_seen", "1");
    const hiddenFrames: number[] = [];
    Object.assign(window, { hiddenIntroShellFrames: hiddenFrames });
    const sample = () => {
      if (Array.from(document.querySelectorAll("[data-intro-background]")).some((element) =>
        getComputedStyle(element).visibility === "hidden",
      )) hiddenFrames.push(performance.now());
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  let releaseChunks!: () => void;
  const chunksReady = new Promise<void>((resolve) => { releaseChunks = resolve; });
  await page.route("**/_next/static/chunks/**", async (route) => {
    if (route.request().resourceType() === "script") await chunksReady;
    await route.continue();
  });
  try {
    await page.goto("/en", { waitUntil: "commit" });
    await expectBackgroundFocusable(page);
    await page.waitForFunction(() => performance.now() >= 3000);
    releaseChunks();
    await expect(page.locator("[data-intro-overlay]")).toHaveCount(0);
    expect(await page.evaluate(() =>
      (window as unknown as { hiddenIntroShellFrames: number[] }).hiddenIntroShellFrames,
    )).toEqual([]);
    for (const locale of ["pt", "es"]) {
      await page.goto(`/${locale}`);
      await expect(page.locator("[data-intro-overlay]")).toHaveCount(0);
      await expectBackgroundFocusable(page);
      expect(await page.evaluate(() =>
        (window as unknown as { hiddenIntroShellFrames: number[] }).hiddenIntroShellFrames,
      )).toEqual([]);
    }
  } finally {
    releaseChunks();
  }
});

test("reduced motion hides the server overlay before hydration", async ({ page }) => {
  await page.route("**/_next/**/*.js*", (route) => route.abort());
  await page.goto("/pt");
  const portfolio = page.getByText("Portfolio", { exact: true });
  await expect(portfolio).toHaveCount(1);
  await expect(portfolio).toBeHidden();
  await expectBackgroundFocusable(page);
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
    await expectBackgroundFocusable(page);
    await page.getByRole("link", { name: "About me" }).click();
    await expect(page).toHaveURL(/\/en\/about$/);
  } finally {
    await context.close();
  }
});

test("failed application chunks release the overlay after six seconds", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/_next/static/chunks/**", (route) =>
    route.request().resourceType() === "script" ? route.abort() : route.continue(),
  );
  await page.goto("/en");
  const overlay = page.locator("[data-intro-overlay]");
  await expect(overlay).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(0);
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() =>
    !!document.activeElement?.closest("main, header, footer"),
  )).toBe(false);
  await expect(overlay).toBeHidden({ timeout: 6500 });
  await expect(overlay).toHaveCSS("pointer-events", "none");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectBackgroundFocusable(page);
  if ((page.viewportSize()?.width ?? 0) < 640) {
    // With failed JS the mobile menu cannot open. Check a native keyboard
    // control instead; blocking CSS too would accidentally expose desktop links.
    const language = page.getByRole("combobox");
    await language.focus();
    await page.keyboard.press("ArrowDown");
    await expect(language).toHaveValue("pt");
  } else {
    await page.getByRole("link", { name: "About me" }).click();
    await expect(page).toHaveURL(/\/en\/about$/);
  }
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
      const samples: { time: number; shown: boolean; inert: boolean; isolated: boolean }[] = [];
      Object.assign(window, { introFrames: samples });
      const sample = () => {
        const overlay = document.querySelector("[data-intro-overlay]");
        const style = overlay && getComputedStyle(overlay);
        const background = Array.from(document.querySelectorAll<HTMLElement>("main, header, footer"));
        samples.push({
          time: performance.now(),
          shown: !!style && style.display !== "none" && style.visibility !== "hidden",
          inert: document.querySelector("main")?.inert ?? false,
          isolated: background.length === 3 && background.every((element) =>
            element.inert || getComputedStyle(element).visibility === "hidden",
          ),
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
      for (let tab = 0; tab < 8; tab++) {
        await page.keyboard.press("Tab");
        expect(await page.evaluate(() =>
          !!document.activeElement?.closest("main, header, footer"),
        )).toBe(false);
      }
      // Hidden shell content is also excluded from role queries/accessibility.
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(0);
      await expect(page.getByRole("link")).toHaveCount(0);
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
          introFrames: { time: number; shown: boolean; inert: boolean; isolated: boolean }[];
        }
      ).introFrames);
      expect(frames.filter((frame) => frame.inert && !frame.shown)).toEqual([]);
      expect(frames.filter((frame) => frame.shown && !frame.isolated)).toEqual([]);
      if (hydrationDelay > 6000) {
        const afterHydration = frames.filter((frame) => frame.time >= releasedAt);
        expect(afterHydration.length).toBeGreaterThan(0);
        expect(afterHydration.some((frame) => frame.shown || frame.inert)).toBe(false);
      }
      await expectBackgroundFocusable(page);
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

for (const duringFade of [false, true]) {
  test(`enabling reduced motion ${duringFade ? "during fade" : "after takeover"} releases the page with the overlay`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/en");
    const overlay = page.locator("[data-intro-overlay]");
    await expect(overlay).toHaveAttribute("data-intro-controlled", "");
    await expect(page.locator("main")).toHaveAttribute("inert", "");
    if (duringFade) {
      await page.waitForFunction(() => {
        const overlay = document.querySelector("[data-intro-overlay]");
        const opacity = overlay && Number(getComputedStyle(overlay).opacity);
        return opacity !== null && opacity > 0 && opacity < 1;
      });
    }

    // Sample the media event and the next two frames, without polling past the
    // regression's hidden-but-inert interval or the normal completion timer.
    await page.evaluate(() => {
      const frames: { shown: boolean; inert: boolean }[] = [];
      const media = matchMedia("(prefers-reduced-motion: reduce)");
      Object.assign(window, {
        reducedMotionFrames: new Promise<typeof frames>((resolve) => {
          media.addEventListener("change", () => {
            const sample = () => {
              const overlay = document.querySelector("[data-intro-overlay]");
              const style = overlay && getComputedStyle(overlay);
              frames.push({
                shown: !!style && style.display !== "none" &&
                  style.visibility !== "hidden" && Number(style.opacity) > 0,
                inert: document.querySelector("main")?.inert ?? false,
              });
              if (frames.length < 3) requestAnimationFrame(sample);
              else resolve(frames);
            };
            sample();
          }, { once: true });
        }),
      });
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const frames = await page.evaluate(() => (
      window as unknown as {
        reducedMotionFrames: Promise<{ shown: boolean; inert: boolean }[]>;
      }
    ).reducedMotionFrames);
    expect(frames.filter((frame) => frame.inert !== frame.shown)).toEqual([]);
    expect(frames.at(-1)).toEqual({ shown: false, inert: false });
    await expect(overlay).toHaveCount(0);
    expect(await page.evaluate(() => sessionStorage.getItem("fc_intro_seen"))).toBe("1");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(overlay).toHaveCount(0);
    await expect(page.locator("main")).not.toHaveAttribute("inert", "");
  });
}

test("pre-paint returning marker stays authoritative if storage changes before hydration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  let releaseChunks!: () => void;
  const chunksReady = new Promise<void>((resolve) => { releaseChunks = resolve; });
  await page.addInitScript(() => sessionStorage.setItem("fc_intro_seen", "1"));
  await page.route("**/_next/static/chunks/**", async (route) => {
    if (route.request().resourceType() === "script") await chunksReady;
    await route.continue();
  });
  try {
    await page.goto("/en", { waitUntil: "commit" });
    await expect(page.locator("html")).toHaveAttribute("data-intro-seen", "");
    const overlay = page.locator("[data-intro-overlay]");
    await expect(overlay).toBeHidden();
    await page.evaluate(() => {
      sessionStorage.removeItem("fc_intro_seen");
      const mutations: string[] = [];
      Object.assign(window, { introInertMutations: mutations });
      const main = document.querySelector("main")!;
      new MutationObserver((records) => {
        mutations.push(...records.map((record) => record.attributeName!));
      }).observe(main, { attributes: true, attributeFilter: ["inert"] });
    });
    releaseChunks();
    await expect(overlay).toHaveCount(0);
    await expect(page.locator("main")).not.toHaveAttribute("inert", "");
    expect(await page.evaluate(() => (
      window as unknown as { introInertMutations: string[] }
    ).introInertMutations)).toEqual([]);
  } finally {
    releaseChunks();
  }
});

test("intro suspends keyboard controls that could claim main inert state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  await expect(page.locator("[data-intro-overlay]")).toHaveAttribute("data-intro-controlled", "");
  for (const selector of ["main", "header", "footer"]) {
    await expect(page.locator(selector)).toHaveAttribute("inert", "");
  }
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() =>
    !!document.activeElement?.closest("main, header, footer"),
  )).toBe(false);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-intro-overlay]")).toHaveCount(0);
  for (const selector of ["main", "header", "footer"]) {
    await expect(page.locator(selector)).not.toHaveAttribute("inert", "");
  }
  const menu = page.getByRole("button", { name: "Open menu" });
  if (await menu.isVisible()) {
    await menu.click();
    await expect(page.locator("main")).toHaveAttribute("inert", "");
    await page.keyboard.press("Escape");
    await expect(page.locator("main")).not.toHaveAttribute("inert", "");
    await menu.click();
  }
  await page.getByRole("link", { name: "About me" }).click();
  await expect(page).toHaveURL(/\/en\/about$/);
});
