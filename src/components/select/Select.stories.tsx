import { Meta } from "@storybook/react-vite";

import { useState } from "react";

import { action } from "storybook/actions";

import { Select } from "./Select";
import { options } from "./_fixtures";

const onChangeAction = action("onChange");

const meta = {
  title: "Components/Select",
  component: Select,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Select>;
export default meta;

export const Basic = () => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        <Select
          placeholder="Select your town..."
          options={options}
          value={value}
          onChange={(value) => {
            onChangeAction(value);
            setValue(value);
          }}
        ></Select>
      </div>
    </>
  );
};
