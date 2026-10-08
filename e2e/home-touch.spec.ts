import { test, expect } from "./fixtures";
import { HomePage } from "./pages/home-page";

test("landscape touch swipe reveals the home contact buttons", async ({
  page,
  context,
  isMobile,
  hasTouch,
  viewport,
}, testInfo) => {
  test.skip(
    !isMobile || !hasTouch || !viewport || viewport.width <= viewport.height,
    "requires the touch-enabled mobile landscape project",
  );

  const home = new HomePage(page);
  await home.goto();
  await expect(home.canvas).toBeVisible();
  // Wait for OrbitControls to connect: its touch-action is what blocked native swipes.
  await expect(home.canvas.locator("xpath=../..")).toHaveCSS("touch-action", "none");
  const hero = home.heading.locator("xpath=ancestor::section");
  const contacts = ["WhatsApp", "Email", "GitHub", "LinkedIn"];
  await expect(home.contactButton("GitHub")).not.toBeInViewport({ ratio: 1 });
  const scrollPosition = () => hero.evaluate((section) => window.scrollY + section.scrollTop);
  const initialScroll = await scrollPosition();
  const box = await home.canvas.boundingBox();
  expect(box).not.toBeNull();
  const x = box!.x + box!.width / 2;
  const startY = Math.min(box!.y + box!.height, viewport!.height) - 30;
  const endY = Math.max(box!.y, 0) + 30;

  await testInfo.attach("landscape-before-swipe", {
    body: await page.screenshot(),
    contentType: "image/png",
  });
  // Browser input, rather than dispatchEvent or scrollTop, exercises native scrolling.
  const session = await context.newCDPSession(page);
  try {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y: startY }],
    });
    for (let step = 1; step <= 12; step++) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x, y: startY + ((endY - startY) * step) / 12 }],
      });
      // Space input samples so Chromium recognizes a swipe, including compositor work.
      await page.waitForTimeout(20);
    }
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  } finally {
    await session.detach();
  }
  await testInfo.attach("landscape-after-swipe", {
    body: await page.screenshot(),
    contentType: "image/png",
  });

  await expect.poll(scrollPosition)
    .toBeGreaterThan(initialScroll + 20);
  for (const name of contacts) {
    await expect(home.contactButton(name)).toBeInViewport({ ratio: 1 });
    await expect(home.contactButton(name)).toBeEnabled();
  }
  // Rotating back to portrait restores the original interactive canvas policy.
  await page.setViewportSize({ width: viewport!.height, height: viewport!.width });
  await expect(home.canvas).toHaveCSS("pointer-events", "auto");
  await expect(home.canvas.locator("xpath=../..")).toHaveCSS("touch-action", "none");
});
