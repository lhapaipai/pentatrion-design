import { useState } from "react";
import type { Meta } from "@storybook/react-vite";
import { PaletteSwatchGrid } from "./PaletteSwatchGrid";
import { defaultPaletteColor, Palette } from "./config";
import { getColorValue } from "./util";

const meta = {
  title: "Components/Color/PaletteSwatchGrid",
  component: PaletteSwatchGrid,
} satisfies Meta<typeof PaletteSwatchGrid>;
export default meta;

const samplePalette: Palette = {
  primary: "#ffca0a",
  secondary: "#3b82f6",
  tertiary: "#ec4899",
  text: "#323232",
};

const variantsRamp = [-75, -25, 0, 25, 85, 90, 95];

const Playbook = () => {
  const [value1, setValue1] = useState(defaultPaletteColor);
  const [value2, setValue2] = useState(defaultPaletteColor);

  return (
    <>
      <PaletteSwatchGrid
        palette={samplePalette}
        value={value1}
        onChange={(v) => v && setValue1(v)}
      />
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
      <PaletteSwatchGrid
        palette={samplePalette}
        value={value2}
        onChange={(v) => v && setValue2(v)}
        variants={variantsRamp}
      />
    </>
  );
};

export { Playbook as PaletteSwatchGrid };
