import type { Meta, StoryObj } from "@storybook/react";

import { InputButton } from "./InputButton";

const meta = {
  title: "Components/Input/InputButton",
  component: InputButton,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof InputButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    placeholder: "Some long content",
  },
};
