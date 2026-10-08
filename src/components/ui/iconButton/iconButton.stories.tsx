import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Image from "next/image";
import { expect, fn, userEvent, within } from "storybook/test";
import IconButton from ".";

const meta = {
  title: "UI/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: {
    label: "Close menu",
    variant: "drawerClose",
    children: <>&times;</>,
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["menu", "drawerClose", "panelClose"],
    },
    children: { control: false },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Menu: Story = {
  args: {
    variant: "menu",
    label: "Open menu",
    children: (
      <Image src="/menu-icon.svg" alt="" width={24} height={24} />
    ),
  },
};

export const DrawerClose: Story = {
  args: { variant: "drawerClose", label: "Close menu" },
};

export const PanelClose: Story = {
  args: { variant: "panelClose", label: "Close credits" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <IconButton {...args} variant="menu" label="Open menu">
        <Image src="/menu-icon.svg" alt="" width={24} height={24} />
      </IconButton>
      <IconButton {...args} variant="drawerClose" label="Close menu">
        &times;
      </IconButton>
      <IconButton {...args} variant="panelClose" label="Close credits">
        &times;
      </IconButton>
    </div>
  ),
};

export const KeyboardFocusAndActivate: Story = {
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button", {
      name: "Close menu",
    });

    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");

    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
