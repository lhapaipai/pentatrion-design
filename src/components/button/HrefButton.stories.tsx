import type { Meta, StoryObj } from "@storybook/react";

import { HrefButton } from "./HrefButton";

const meta = {
  title: "Components/HrefButton",
  component: HrefButton,
} satisfies Meta<typeof HrefButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Hello world",
  },
};
