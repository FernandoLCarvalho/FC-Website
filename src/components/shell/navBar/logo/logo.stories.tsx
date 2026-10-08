import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import NavBarLogo from ".";

const meta = {
  title: "Shell/NavBar/Logo",
  component: NavBarLogo,
  tags: ["autodocs"],
} satisfies Meta<typeof NavBarLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
