import type { ComponentType } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import NavItem, { type NavItemProps } from ".";

// NavItemProps is a link-or-button union that Storybook cannot turn into args,
// so the stories drive it through this flat shape (href => link, onClick => button).
type NavItemArgs = Pick<NavItemProps, "id" | "label" | "variant" | "onActivate"> & {
  href?: string;
  onClick?: () => void;
  expanded?: boolean;
  controls?: string;
};

const meta = {
  title: "UI/NavItem",
  component: NavItem as unknown as ComponentType<NavItemArgs>,
  tags: ["autodocs"],
  args: {
    id: "about",
    label: "About me",
    variant: "desktop",
    href: "/about",
    onActivate: fn(),
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["desktop", "mobile"] },
  },
  decorators: [
    (Story, { args }) => (
      <div
        style={{
          width: args.variant === "mobile" ? 280 : "auto",
          color: "white",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<NavItemArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopLink: Story = {};

export const MobileLink: Story = {
  args: { variant: "mobile" },
};

export const DesktopButton: Story = {
  args: {
    id: "assetCredits",
    label: "Credits",
    href: undefined,
    onClick: fn(),
    expanded: false,
    controls: "asset-credits-panel",
  },
};

export const DesktopButtonExpanded: Story = {
  args: { ...DesktopButton.args, expanded: true },
};

export const MobileButton: Story = {
  args: { ...DesktopButton.args, variant: "mobile" },
};

export const ActivatesLink: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("link"));

    await expect(args.onActivate).toHaveBeenCalledTimes(1);
  },
};

export const ActivatesButton: Story = {
  args: { ...DesktopButton.args },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button"));

    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(args.onActivate).toHaveBeenCalledTimes(1);
  },
};
