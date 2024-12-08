import { Meta } from "@storybook/react";
import { Range } from "./Range";
import { useState } from "react";

const meta = {
  title: "Components/Input/Range",
  component: Range,

  // prevent Storybook bug: https://github.com/storybookjs/storybook/issues/29189
  // Storybook preview hooks can only be called inside decorators and story functions.
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Range>;
export default meta;

function pxFormatter(nb: number) {
  return `${nb}px`;
}

export const Basic = () => {
  const [value, setValue] = useState(30);
  const [value2, setValue2] = useState(0.5);

  return (
    <div className="grid gap-8">
      <Range valuesByTick={1} value={value} onChange={(e) => setValue(e.target.valueAsNumber)} />
      <Range valuesByTick={5} value={value} onChange={(e) => setValue(e.target.valueAsNumber)} />
      <Range valuesByTick={50} value={value} onChange={(e) => setValue(e.target.valueAsNumber)} />
      <Range
        color="gray"
        valuesByTick={5}
        ticks={true}
        value={value}
        onChange={(e) => setValue(e.target.valueAsNumber)}
      />
      <Range
        color="red"
        valuesByTick={5}
        value={value}
        onChange={(e) => setValue(e.target.valueAsNumber)}
      />
      <Range
        color="blue"
        valuesByTick={5}
        value={value}
        onChange={(e) => setValue(e.target.valueAsNumber)}
      />
      <Range
        color="orange"
        valuesByTick={5}
        value={value}
        onChange={(e) => setValue(e.target.valueAsNumber)}
      />
      <Range
        color="green"
        valuesByTick={5}
        value={value}
        onChange={(e) => setValue(e.target.valueAsNumber)}
        formatter={pxFormatter}
      />
      <Range
        value={value2}
        onChange={(e) => setValue2(e.target.valueAsNumber)}
        step={0.1}
        min={0}
        max={2}
      />
      <Range
        value={value2}
        onChange={(e) => setValue2(e.target.valueAsNumber)}
        step={0.01}
        min={0}
        max={2}
      />
      <div className="w-24">
        <Range
          value={value2}
          onChange={(e) => setValue2(e.target.valueAsNumber)}
          step={0.5}
          min={0}
          max={2}
        />
      </div>
      <div className="w-12">
        <Range
          value={value2}
          onChange={(e) => setValue2(e.target.valueAsNumber)}
          step={0.5}
          min={0}
          max={2}
        />
      </div>
      <h3 className="mb-4 mt-8">Uncontrolled</h3>
      <Range defaultValue={value2} step={0.01} min={0} max={2} />
    </div>
  );
};
