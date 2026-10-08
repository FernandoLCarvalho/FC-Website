import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Icon, { type IconName } from ".";

const iconNames: IconName[] = ["whatsapp", "envelope", "github", "linkedin"];

const meta = {
  title: "UI/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: {
    name: "github",
    size: 32,
  },
  argTypes: {
    name: { control: "select", options: iconNames },
    size: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ color: "white" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllIcons: Story = {
  render: (args) => (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        gap: 24,
        listStyle: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {iconNames.map((name) => (
        <li
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
          }}
        >
          <Icon {...args} name={name} />
          <code>{name}</code>
        </li>
      ))}
    </ul>
  ),
  parameters: { layout: "padded" },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
      {[16, 24, 32, 48, 64].map((size) => (
        <Icon key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const WithAccessibleName: Story = {
  args: { "aria-hidden": false },
};
