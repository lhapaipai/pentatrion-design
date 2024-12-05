import { Meta } from "@storybook/react";
import { useState } from "react";
import { RadioGroup } from "./RadioGroup";
import clsx from "clsx";

const meta = {
  title: "Components/Input/RadioGroup",
  component: RadioGroup,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof RadioGroup>;
export default meta;

const options = [
  {
    label: "Climbing",
    value: "climbing",
  },
  {
    label: "Tennis",
    value: "tennis",
  },
  {
    label: "Soccer",
    value: "soccer",
  },
];

export const Basic = () => {
  const [value, setValue] = useState<string | null>(null);
  const variants = ["contained", "light", "outlined", "text", "ghost"] as const;
  return (
    <>
      <div className="flex flex-col gap-4">
        <RadioGroup
          color="yellow"
          placement="inline"
          options={options}
          value={value}
          onChange={setValue}
        />
        <RadioGroup
          color="gray"
          placement="inline"
          options={options}
          value={value}
          onChange={setValue}
        />
        <RadioGroup
          color="red"
          placement="inline"
          options={options}
          value={value}
          onChange={setValue}
        />
        <RadioGroup
          color="orange"
          placement="inline"
          options={options}
          value={value}
          onChange={setValue}
        />
        <RadioGroup
          color="green"
          placement="inline"
          options={options}
          value={value}
          onChange={setValue}
        />
        <RadioGroup
          color="blue"
          placement="inline"
          options={options}
          value={value}
          onChange={setValue}
        />
        <RadioGroup placement="inline-grid" options={options} value={value} onChange={setValue} />
        <RadioGroup options={options} value={value} onChange={setValue} />
      </div>

      {variants.map((variant) => (
        <div key={variant} className="flex flex-col gap-4">
          <h3 className="text-body-md">Variant : {variant}</h3>
          <div className="grid grid-cols-2">
            {(["button", "button-group"] as const).map((shape) => (
              <div key={shape} className="grid grid-cols-1 gap-2">
                <RadioGroup
                  className={clsx(shape === "button" && "flex gap-2")}
                  shape={shape}
                  color="yellow"
                  options={options}
                  value={value}
                  onChange={setValue}
                  variant={variant}
                />
                <RadioGroup
                  className={clsx(shape === "button" && "flex gap-2")}
                  shape={shape}
                  color="gray"
                  options={options}
                  value={value}
                  onChange={setValue}
                  variant={variant}
                />
                <RadioGroup
                  className={clsx(shape === "button" && "flex gap-2")}
                  shape={shape}
                  color="red"
                  options={options}
                  value={value}
                  onChange={setValue}
                  variant={variant}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
