import { test, expect } from "./fixtures";
import { HomePage } from "./pages/home-page";

test.describe("home", () => {
  test("renders name, role and intro copy", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(home.heading).toHaveAccessibleName("Fernando Carvalho");
    await expect(
      page.getByText("Software Engineer · Full-stack with .NET, React and Azure"),
    ).toBeVisible();
    await expect(page.getByText(/I build React\/Next\.js product/)).toBeVisible();
  });

  test("mounts the 3D canvas", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(home.canvas).toBeVisible();
    const box = await home.canvas.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });

  test.describe("real star model", () => {
    test.use({ stubStarModel: false });

    test("the 3D model asset loads", async ({ page }) => {
      const home = new HomePage(page);
      const modelResponse = page.waitForResponse(/\/glb\/.*\.glb/);
      await home.goto();

      expect((await modelResponse).status()).toBe(200);
      await expect(home.canvas).toBeVisible();
    });
  });

  test("shows the four contact buttons, all enabled", async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    for (const name of ["WhatsApp", "Email", "GitHub", "LinkedIn"]) {
      await expect(home.contactButton(name)).toBeEnabled();
    }
  });

  const contactLinks = [
    { name: "WhatsApp", url: /^https:\/\/wa\.me\/5562999999999\?text=Hello/ },
    {
      name: "Email",
      url: /^mailto:nando_carvalhoo@hotmail\.com\?subject=Software%20engineering%20opportunity$/,
    },
    { name: "GitHub", url: "https://github.com/FernandoLCarvalho" },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/fernandolcarvalho/",
    },
  ];

  for (const { name, url } of contactLinks) {
    test(`${name} button opens the contact link in a new tab`, async ({
      page,
    }) => {
      const home = new HomePage(page);
      await home.goto();

      // Intercept window.open so the test never leaves the app or hits external sites.
      await page.evaluate(() => {
        (window as unknown as { __opened: unknown[] }).__opened = [];
        window.open = ((...args: unknown[]) => {
          (window as unknown as { __opened: unknown[] }).__opened.push(args);
          return null;
        }) as typeof window.open;
      });

      await home.contactButton(name).click();

      const opened = await page.evaluate(
        () => (window as unknown as { __opened: unknown[][] }).__opened,
      );
      expect(opened).toHaveLength(1);
      const [href, target, features] = opened[0] as [string, string, string];
      if (typeof url === "string") expect(href).toBe(url);
      else expect(href).toMatch(url);
      expect(target).toBe("_blank");
      expect(features).toBe("noopener,noreferrer");
    });
  }
});
