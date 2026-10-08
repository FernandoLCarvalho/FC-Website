import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Eyebrow from ".";

const meta = {
  title: "UI/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
  args: {
    variant: "home",
    children: "Software Engineer · Full-stack with .NET, React and Azure",
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["home", "profile"] },
  },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = { args: { variant: "home" } };

export const Profile: Story = {
  args: {
    variant: "profile",
    children: "Full-stack engineering · .NET, React and Azure · Product mindset",
  },
};
