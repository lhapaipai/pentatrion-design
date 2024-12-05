import type { Meta, StoryObj } from "@storybook/react";

import { Stars } from "./Stars";
import { useState } from "react";

const meta = {
  title: "Components/Input/Stars",

  component: Stars,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Stars>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 3,
  },
};

export const Context = () => {
  const [value, setValue] = useState(3);
  return (
    <div>
      <h3 className="text-body-md">Uncontrolled</h3>
      <Stars defaultValue={4} />
      <h3 className="mt-4 text-body-md">Controlled</h3>
      <Stars value={value} onChange={(val) => setValue(val)} />
    </div>
  );
};
