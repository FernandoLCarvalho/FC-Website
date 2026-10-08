import type { Locator } from "@playwright/test";
import { test, expect } from "./fixtures";
import { HomePage } from "./pages/home-page";

// A visible asymmetric triangle exercises the actual scene/controls without the
// 15k-star model starving headless software GL during mouse input.
const vertices = new Float32Array([-0.4, -0.3, 0, 0.5, -0.2, 0, 0.1, 0.5, 0]);
const ORBIT_TEST_MODEL = JSON.stringify({
  asset: { version: "2.0" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0 }],
  meshes: [{ primitives: [{ attributes: { POSITION: 0 }, material: 0 }] }],
  materials: [{ emissiveFactor: [1, 0.4, 0.1], doubleSided: true }],
  buffers: [{
    uri: `data:application/octet-stream;base64,${Buffer.from(vertices.buffer).toString("base64")}`,
    byteLength: vertices.byteLength,
  }],
  bufferViews: [{ buffer: 0, byteLength: vertices.byteLength }],
  accessors: [{
    bufferView: 0,
    componentType: 5126,
    count: 3,
    type: "VEC3",
    min: [-0.4, -0.3, 0],
    max: [0.5, 0.5, 0],
  }],
});

async function settledImage(canvas: Locator) {
  let previous = await canvas.screenshot();
  let stableFrames = 0;
  await expect.poll(async () => {
    const current = await canvas.screenshot();
    // Consecutive matching captures avoid interacting during a pause between
    // the first model render and the controls/camera settling.
    stableFrames = current.equals(previous) ? stableFrames + 1 : 0;
    previous = current;
    return stableFrames >= 3;
  }, { timeout: 20_000, intervals: [500] }).toBe(true);
  return previous;
}

test.describe("home orbit interaction", () => {
  test("desktop mouse drag and wheel still change the star scene", async ({
    page,
    isMobile,
  }, testInfo) => {
    test.skip(isMobile, "desktop mouse controls");
    test.setTimeout(60_000);
    await page.route("**/glb/*.glb", (route) => route.fulfill({
      contentType: "model/gltf+json",
      body: ORBIT_TEST_MODEL,
    }));
    const home = new HomePage(page);
    const modelResponse = page.waitForResponse(/\/glb\/.*\.glb/);
    await home.goto();
    expect((await modelResponse).status()).toBe(200);
    // Controls mount after the model response; allow scene startup under load.
    await expect(home.canvas.locator("xpath=../..")).toHaveCSS("touch-action", "none", { timeout: 20_000 });
    await expect(home.canvas).toHaveCSS("pointer-events", "auto");
    await expect(home.canvas.locator("..").getByText(/^\d+(?:\.\d+)?%$/)).toHaveCount(0);
    const initial = await settledImage(home.canvas);
    const box = await home.canvas.boundingBox();
    expect(box).not.toBeNull();
    // An uncovered corner of the canvas avoids the interactive contact buttons.
    const x = box!.x + 80;
    const y = box!.y + 80;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 180, y + 60, { steps: 12 });
    await page.mouse.up();
    const rotated = await settledImage(home.canvas);
    expect(rotated.equals(initial), "mouse drag should rotate the stars").toBe(false);
    await page.mouse.wheel(0, -400);
    const zoomed = await settledImage(home.canvas);
    expect(zoomed.equals(rotated), "wheel should zoom the stars").toBe(false);
    for (const [name, body] of [
      ["desktop-initial", initial],
      ["desktop-rotated", rotated],
      ["desktop-zoomed", zoomed],
    ] as const) {
      await testInfo.attach(name, { body, contentType: "image/png" });
    }
  });
});
