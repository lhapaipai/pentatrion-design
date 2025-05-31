import type { Meta, StoryObj } from "@storybook/react-vite";

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
  const [value1, setValue1] = useState<number | null>(3);
  const [value2, setValue2] = useState<number | null>(3);
  return (
    <div>
      <h3 className="text-body-md">Uncontrolled</h3>
      <Stars defaultValue={null} />
      <Stars defaultValue={4} required={true} />
      <h3 className="mt-4 text-body-md">Controlled</h3>
      <Stars value={value1} onChange={(val) => setValue1(val)} />
      <Stars value={value2} required={true} onChange={(val) => setValue2(val)} />
    </div>
  );
};
