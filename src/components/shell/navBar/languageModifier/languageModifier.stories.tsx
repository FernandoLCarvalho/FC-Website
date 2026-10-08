import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import LanguageModifier from ".";

const meta = {
  title: "Shell/NavBar/LanguageModifier",
  component: LanguageModifier,
  tags: ["autodocs"],
  args: {
    locale: "en",
    onLocaleChange: fn(),
  },
  argTypes: {
    locale: { control: "inline-radio", options: ["en", "pt", "es"] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 160 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LanguageModifier>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {};

export const Portuguese: Story = { args: { locale: "pt" } };

export const Spanish: Story = { args: { locale: "es" } };

export const ChangesLocale: Story = {
  play: async ({ args, canvasElement }) => {
    const select = within(canvasElement).getByRole("combobox");

    await userEvent.selectOptions(select, "pt");

    await expect(args.onLocaleChange).toHaveBeenCalledWith("pt");
  },
};
