import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LoadingScreen from ".";

const meta = {
  title: "UI/LoadingScreen",
  component: LoadingScreen,
  tags: ["autodocs"],
  args: {
    visible: true,
    isPortfolioHighlighted: false,
    hidePortfolio: false,
    hideBrandName: false,
    fadeOverlay: false,
  },
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "240px" } },
  },
} satisfies Meta<typeof LoadingScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PortfolioHighlighted: Story = {
  args: { isPortfolioHighlighted: true },
};

export const PortfolioHidden: Story = {
  args: { hidePortfolio: true },
};

export const BrandNameHidden: Story = {
  args: { hideBrandName: true, isPortfolioHighlighted: true },
};

export const FadingOut: Story = {
  args: { fadeOverlay: true },
};

export const NotVisible: Story = {
  args: { visible: false },
};

export const Mobile: Story = {
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
};
