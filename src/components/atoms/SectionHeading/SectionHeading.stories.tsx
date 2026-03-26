import type { Meta, StoryObj } from "@storybook/react";

import { SectionHeading } from "./SectionHeading";

const meta = {
  title: "Atoms/SectionHeading",
  component: SectionHeading,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  tags: ["autodocs"],
  argTypes: {
    as: { control: "select", options: ["h1", "h2", "h3"] },
  },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Building efficient solutions",
    as: "h2",
  },
};

export const AsH1: Story = {
  args: {
    children: "Portfolio",
    as: "h1",
  },
};
