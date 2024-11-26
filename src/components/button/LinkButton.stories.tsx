import type { Meta, StoryObj } from "@storybook/react";

import { LinkButton } from "./LinkButton";

const meta = {
  title: "Components/LinkButton",
  component: LinkButton,
} satisfies Meta<typeof LinkButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Hello world",
  },
};
