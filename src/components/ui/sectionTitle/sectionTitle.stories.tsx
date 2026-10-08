import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SectionTitle from ".";

const meta = {
  title: "UI/SectionTitle",
  component: SectionTitle,
  tags: ["autodocs"],
  args: {
    children: "Professional stack",
    variant: "section",
    as: "h2",
  },
  argTypes: {
    as: { control: "inline-radio", options: ["h1", "h2", "h3"] },
    variant: { control: "inline-radio", options: ["page", "section", "card"] },
  },
} satisfies Meta<typeof SectionTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Page: Story = { args: { variant: "page", as: "h1" } };

export const Section: Story = { args: { variant: "section", as: "h2" } };

export const CardTitle: Story = { args: { variant: "card", as: "h3" } };

export const AllVariants: Story = {
  render: (args) => (
    <div>
      <SectionTitle {...args} as="h1" variant="page">
        Page title (h1)
      </SectionTitle>
      <SectionTitle {...args} as="h2" variant="section">
        Section title (h2)
      </SectionTitle>
      <SectionTitle {...args} as="h3" variant="card">
        Card title (h3)
      </SectionTitle>
    </div>
  ),
};

export const LevelIndependentOfLook: Story = {
  render: (args) => (
    <SectionTitle {...args} as="h1" variant="card">
      Card look, h1 semantics
    </SectionTitle>
  ),
};
