import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ContentSection from ".";

const meta = {
  title: "UI/ContentSection",
  component: ContentSection,
  tags: ["autodocs"],
  args: {
    width: "content",
    spacing: "none",
    align: "start",
    children: (
      <p style={{ margin: 0 }}>
        Section content: width, spacing and alignment are independent props.
      </p>
    ),
  },
  argTypes: {
    width: { control: "inline-radio", options: ["content", "narrow"] },
    spacing: { control: "inline-radio", options: ["none", "section", "map"] },
    align: { control: "inline-radio", options: ["start", "center"] },
  },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          outline: "1px dashed #3a3a3a",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContentSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Content: Story = {};

export const Narrow: Story = { args: { width: "narrow" } };

export const SectionSpacing: Story = { args: { spacing: "section" } };

export const MapSpacing: Story = { args: { spacing: "map" } };

export const Centered: Story = { args: { align: "center" } };

export const NarrowCentered: Story = {
  args: { width: "narrow", align: "center" },
};
