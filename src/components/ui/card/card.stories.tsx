import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SectionTitle from "@components/ui/sectionTitle";
import Card from ".";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    children: (
      <>
        <SectionTitle as="h3" variant="card">
          Product Frontend
        </SectionTitle>
        <p style={{ margin: 0 }}>
          Complex SaaS interfaces with reusable UI patterns, predictable state,
          forms, tables, dashboards and responsive behavior.
        </p>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongContent: Story = {
  args: {
    children: (
      <>
        <SectionTitle as="h3" variant="card">
          A card with a considerably longer title that has to wrap
        </SectionTitle>
        <p style={{ margin: 0 }}>
          {"Long content keeps wrapping inside the card without breaking its layout. ".repeat(
            6,
          )}
        </p>
      </>
    ),
  },
};

export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
};
