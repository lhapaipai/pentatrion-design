import { useState } from "react";
import type { Meta } from "@storybook/react-vite";
import { ColorPicker } from "./ColorPicker";
import { Color, type ColorTheme, defaultNamedColor, RawColor } from "./config";
import { getColorValue } from "./util";

const meta = {
  title: "Components/Color/ColorPicker",
  component: ColorPicker,
} satisfies Meta<typeof ColorPicker>;
export default meta;

const samplePalette: ColorTheme = {
  primary: "#ffca0a",
  secondary: "#3b82f6",
  tertiary: "#ec4899",
  text: "#323232",
};

const refColor: RawColor = {
  type: "raw",
  value: "#ffca0a",
};

const Playbook = () => {
  const [value, setValue] = useState<Color | null>(defaultNamedColor);

  return (
    <>
      <ColorPicker
        label="Couleur"
        refColor={refColor}
        palette={samplePalette}
        value={value}
        onChange={setValue}
      />
      <Info color={value} />
    </>
  );
};

export { Playbook as ColorPicker };

export const WithInherit = () => {
  const [value, setValue] = useState<Color | null>(defaultNamedColor);

  return (
    <>
      <ColorPicker
        label="Couleur (hérite possible)"
        palette={samplePalette}
        value={value}
        onChange={setValue}
        allowInherit={true}
      />
      <Info color={value} />
    </>
  );
};

function Info({ color }: { color: Color | null }) {
  return (
    <div className="shadow-sm w-72 rounded-2xl mt-4 p-2">
      {color && (
        <>
          <dl className="p8n-setting">
            <dt>type</dt>
            <dd>{color.type}</dd>
          </dl>
          {color.type === "raw" ? (
            <>
              <dl className="p8n-setting">
                <dt>value</dt>
                <dd>{color.value}</dd>
              </dl>
            </>
          ) : color.type === "named" ? (
            <>
              <dl className="p8n-setting">
                <dt>name</dt>
                <dd>{color.name}</dd>
              </dl>
              <dl className="p8n-setting">
                <dt>variant</dt>
                <dd>{color.variant}</dd>
              </dl>
            </>
          ) : null}
          <dl className="p8n-setting">
            <dt>preview</dt>
            <dd>
              <span
                className="inline-block h-6 w-6 rounded shadow"
                style={{
                  backgroundColor: getColorValue(color, samplePalette),
                }}
              ></span>
            </dd>
          </dl>
        </>
      )}
    </div>
  );
}
