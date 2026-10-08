import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import NavBar from ".";

const MOBILE_VIEWPORT = { value: "mobile1", isRotated: false };

const meta = {
  title: "Shell/NavBar",
  component: NavBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    pathname: "/",
    docs: { story: { inline: false, height: "360px" } },
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Desktop layout (>= 640px): inline links, credits trigger and language select. */
export const Desktop: Story = {};

export const DesktopAboutPage: Story = {
  parameters: { pathname: "/about" },
};

export const DesktopCreditsOpen: Story = {
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLButtonElement>(
      'nav button[data-nav-item-id="assetCredits"]',
    );

    await userEvent.click(trigger!);

    await waitFor(() =>
      expect(trigger).toHaveAttribute("aria-expanded", "true"),
    );
  },
};

export const Mobile: Story = {
  globals: { viewport: MOBILE_VIEWPORT },
};

export const MobileMenuOpen: Story = {
  globals: { viewport: MOBILE_VIEWPORT },
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLButtonElement>(
      '[aria-controls="mobile-menu"]',
    );

    await userEvent.click(trigger!);

    const drawer = await within(canvasElement).findByRole("dialog");
    await expect(drawer).toBeVisible();
  },
};

export const MobileCreditsOpen: Story = {
  globals: { viewport: MOBILE_VIEWPORT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvasElement.querySelector<HTMLButtonElement>(
      '[aria-controls="mobile-menu"]',
    );

    await userEvent.click(trigger!);
    const drawer = await canvas.findByRole("dialog");
    await userEvent.click(
      drawer.querySelector<HTMLButtonElement>(
        'button[data-nav-item-id="assetCredits"]',
      )!,
    );

    await waitFor(() =>
      expect(
        canvasElement.querySelector("#asset-credits-panel"),
      ).not.toHaveAttribute("inert"),
    );
  },
};
