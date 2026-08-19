import { useState } from "react";
import type { Meta } from "@storybook/react-vite";
import { NamedColorGrid } from "./NamedColorGrid";
import { defaultNamedColor, ColorTheme } from "./config";
import { getColorValue } from "./util";

const meta = {
  title: "Components/Color/NamedColorGrid",
  component: NamedColorGrid,
} satisfies Meta<typeof NamedColorGrid>;
export default meta;

const samplePalette: ColorTheme = {
  primary: "#ffca0a",
  secondary: "#3b82f6",
  tertiary: "#ec4899",
  text: "#323232",
};

const variantsRamp = [-75, -25, 0, 25, 85, 90, 95];

const Playbook = () => {
  const [value1, setValue1] = useState(defaultNamedColor);
  const [value2, setValue2] = useState(defaultNamedColor);

  return (
    <div className="max-w-64">
      <NamedColorGrid palette={samplePalette} color={value1} onChange={(v) => v && setValue1(v)} />
      <div className="shadow-sm w-72 rounded-2xl mt-4 p-2">
        <dl className="p8n-setting">
          <dt>name</dt>
          <dd>{value1.name}</dd>
        </dl>
        <dl className="p8n-setting">
          <dt>variant</dt>
          <dd>{value1.variant}</dd>
        </dl>
        <dl className="p8n-setting">
          <dt>preview</dt>
          <dd>
            <span
              className="inline-block h-6 w-6 rounded shadow"
              style={{
                backgroundColor: getColorValue(value1, samplePalette),
              }}
            ></span>
          </dd>
        </dl>
      </div>
      <NamedColorGrid
        palette={samplePalette}
        color={value2}
        onChange={(v) => v && setValue2(v)}
        variants={variantsRamp}
      />
    </div>
  );
};

export { Playbook as NamedColorGrid };
