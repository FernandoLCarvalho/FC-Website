import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ContentSection from "@components/ui/contentSection";
import SectionTitle from "@components/ui/sectionTitle";
import PageContainer from ".";

const meta = {
  title: "UI/PageContainer",
  component: PageContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, height: "420px" } },
  },
} satisfies Meta<typeof PageContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithSections: Story = {
  render: (args) => (
    <PageContainer {...args}>
      <ContentSection>
        <SectionTitle as="h1" variant="page">
          Page title
        </SectionTitle>
        <p>Intro paragraph inside the page container.</p>
      </ContentSection>
      <ContentSection spacing="section">
        <SectionTitle variant="section">Another section</SectionTitle>
        <p>Sections are spaced by the shared section rhythm.</p>
      </ContentSection>
    </PageContainer>
  ),
};

export const Mobile: Story = {
  ...WithSections,
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
