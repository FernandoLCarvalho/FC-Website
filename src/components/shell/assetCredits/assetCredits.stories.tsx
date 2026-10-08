import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AssetCredits from ".";

const meta = {
  title: "Shell/AssetCredits",
  component: AssetCredits,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{
          width: 420,
          padding: 16,
          color: "white",
          background: "rgba(5, 10, 18, 0.94)",
          border: "1px solid rgba(148, 163, 184, 0.24)",
          borderRadius: 8,
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AssetCredits>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Switch the toolbar locale to check the translated credit lines. */
export const Default: Story = {};
