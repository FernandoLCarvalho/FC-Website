import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Card from "@components/ui/card";
import SectionTitle from "@components/ui/sectionTitle";
import CardGrid from ".";

const cards = [
  ["Product Frontend", "Complex SaaS interfaces with reusable UI patterns."],
  ["API-driven Apps", "Flows that depend on auth, async data and clear errors."],
  ["Spec-Driven AI Workflows", "Automation guided by specs and validation."],
  ["System Understanding", "Reading backend contracts and data flows."],
] as const;

const meta = {
  title: "UI/CardGrid",
  component: CardGrid,
  tags: ["autodocs"],
  args: {
    children: cards.map(([title, text]) => (
      <Card key={title}>
        <SectionTitle as="h3" variant="card">
          {title}
        </SectionTitle>
        <p style={{ margin: 0 }}>{text}</p>
      </Card>
    )),
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof CardGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleCard: Story = {
  args: { children: <Card>Only one card in the grid.</Card> },
};

export const OddCount: Story = {
  args: {
    children: cards.slice(0, 3).map(([title, text]) => (
      <Card key={title}>
        <SectionTitle as="h3" variant="card">
          {title}
        </SectionTitle>
        <p style={{ margin: 0 }}>{text}</p>
      </Card>
    )),
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
