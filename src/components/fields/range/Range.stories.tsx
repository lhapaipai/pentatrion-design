import { Meta } from "@storybook/react-vite";
import { Range } from "./Range";
import { useState } from "react";
import { AudioRange } from "./AudioRange";

const meta = {
  title: "Components/fields/Range",
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
      <AudioRange value={value} onChangeCommitted={setValue} />
      <div className="bg-[url(/bg-map.jpg)] p-2">
        <AudioRange value={value} onChangeCommitted={setValue} />
      </div>

      <Range valuesByTick={1} value={value} onChangeCommitted={setValue} />
      <Range valuesByTick={5} value={value} onChangeCommitted={setValue} />
      <Range valuesByTick={50} value={value} onChangeCommitted={setValue} />
      <Range
        color="gray"
        valuesByTick={5}
        ticks={true}
        value={value}
        onChangeCommitted={setValue}
      />
      <Range color="red" valuesByTick={5} value={value} onChangeCommitted={setValue} />
      <Range color="blue" valuesByTick={5} value={value} onChangeCommitted={setValue} />
      <Range color="orange" valuesByTick={5} value={value} onChangeCommitted={setValue} />
      <Range
        color="green"
        valuesByTick={5}
        value={value}
        onChangeCommitted={setValue}
        formatter={pxFormatter}
      />
      <Range value={value2} onChangeCommitted={setValue2} step={0.1} min={0} max={2} />
      <Range value={value2} onChangeCommitted={setValue2} step={0.01} min={0} max={2} />
      <div className="w-24">
        <Range value={value2} onChangeCommitted={setValue2} step={0.5} min={0} max={2} />
      </div>
      <div className="w-12">
        <Range value={value2} onChangeCommitted={setValue2} step={0.5} min={0} max={2} />
      </div>
      <div>
        <Range
          showMinMax="never"
          showValue={false}
          value={value}
          className="w-32 -rotate-90"
          onChangeCommitted={setValue}
        />
      </div>
    </div>
  );
};
