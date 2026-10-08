import { test as base, expect } from "@playwright/test";

const INTRO_STORAGE_KEY = "fc_intro_seen";
const STAR_MODEL_URL = "**/glb/*.glb";

// Valid but empty glTF: the 3D scene still mounts, without drawing 15k stars every frame.
const EMPTY_GLTF = JSON.stringify({
  asset: { version: "2.0" },
  scene: 0,
  scenes: [{ nodes: [] }],
});

type Fixtures = {
  consoleErrors: string[];
};

type Options = {
  /**
   * Replace the star cluster model with an empty glTF (default). The real scene starves the
   * main thread under headless software GL, which makes clicks and screenshots flaky.
   * Set to false with `test.use` when the real model must load.
   */
  stubStarModel: boolean;
};

export const test = base.extend<Fixtures & Options>({
  stubStarModel: [true, { option: true }],

  page: async ({ page, stubStarModel }, runFixture) => {
    // The session intro overlay blocks the page for ~4.5s; mark it as already seen.
    await page.addInitScript((key) => {
      window.sessionStorage.setItem(key, "1");
    }, INTRO_STORAGE_KEY);

    if (stubStarModel) {
      await page.route(STAR_MODEL_URL, (route) =>
        route.fulfill({ contentType: "model/gltf+json", body: EMPTY_GLTF }),
      );
    }

    await runFixture(page);
  },

  consoleErrors: async ({ page }, runFixture) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await runFixture(errors);
  },
});

export { expect };
