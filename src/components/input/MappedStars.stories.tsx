import type { Meta, StoryObj } from "@storybook/react";

import { MappedStarOption, MappedStars } from "./MappedStars";
import { useState } from "react";

const meta = {
  title: "Components/Input/MappedStars",

  component: MappedStars,
} satisfies Meta<typeof MappedStars>;
export default meta;

type Story = StoryObj<typeof meta>;

const options: MappedStarOption[] = [
  { label: "Débutant", value: "beginner" },
  { label: "Intermédiaire", value: "intermediate" },
  { label: "Avancé", value: "advanced" },
  { label: "Professionnel", value: "pro" },
];

export const Default: Story = {
  args: {
    options,
    value: "intermediate",
  },
};

const ContextWithHook = () => {
  const [value1, setValue1] = useState("beginner");
  const [value2, setValue2] = useState("beginner");
  return (
    <div>
      <h3 className="text-body-md">Uncontrolled</h3>
      <MappedStars options={options} defaultValue="intermediate" />
      <MappedStars showLabel={true} options={options} defaultValue="intermediate" />
      <h3 className="mt-4 text-body-md">Controlled</h3>
      <MappedStars options={options} value={value1} onChange={(val) => setValue1(val)} />
      <MappedStars
        showLabel={true}
        options={options}
        value={value2}
        onChange={(val) => setValue2(val)}
      />
    </div>
  );
};

export const Context = {
  render: () => <ContextWithHook />,
};
