import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import Icon from "@components/ui/icon";
import ExternalLink from ".";

const meta = {
  title: "UI/ExternalLink",
  component: ExternalLink,
  tags: ["autodocs"],
  args: {
    href: "https://example.com/",
    appearance: "credit",
    children: "Sketchfab",
  },
  argTypes: {
    appearance: { control: "inline-radio", options: ["credit", "action"] },
    startIcon: { control: false },
  },
} satisfies Meta<typeof ExternalLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Credit: Story = {};

export const Action: Story = {
  args: { appearance: "action", children: "Visit project" },
};

export const ActionWithIcon: Story = {
  args: {
    appearance: "action",
    children: "GitHub",
    startIcon: <Icon name="github" />,
  },
};

export const OpensSafelyInNewTab: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link");

    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  },
};
