import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import Icon from "@components/ui/icon";
import Button from ".";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Contact me",
    onClick: fn(),
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["contact"] },
    startIcon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contact: Story = {
  args: { variant: "contact" },
};

export const WithStartIcon: Story = {
  args: { startIcon: <Icon name="github" /> },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllIcons: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {(["whatsapp", "envelope", "github", "linkedin"] as const).map((name) => (
        <Button key={name} {...args} startIcon={<Icon name={name} />}>
          {name}
        </Button>
      ))}
    </div>
  ),
};

export const ClickAndKeyboard: Story = {
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button");

    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard("{Enter}");

    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};
