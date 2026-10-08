import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ChipList from ".";

const meta = {
  title: "UI/ChipList",
  component: ChipList,
  tags: ["autodocs"],
  args: {
    items: ["React", "Next.js", "TypeScript", "Node.js"],
  },
} satisfies Meta<typeof ChipList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Single: Story = { args: { items: ["React"] } };

export const Wrapping: Story = {
  args: {
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "CSS Modules",
      "REST APIs",
      "Authentication",
      "Server state",
      "Forms",
      "Tables",
      "Dashboards",
      "Spec-driven workflows",
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export const Empty: Story = { args: { items: [] } };
