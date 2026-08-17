import { useState } from "react";
import type { Meta } from "@storybook/react-vite";
import { ColorPicker } from "./ColorPicker";
import { Color, type Palette, defaultPaletteColor } from "./config";

const meta = {
  title: "Components/Color/ColorPicker",
  component: ColorPicker,
} satisfies Meta<typeof ColorPicker>;
export default meta;

const samplePalette: Palette = {
  primary: "#ffca0a",
  secondary: "#3b82f6",
  tertiary: "#ec4899",
  text: "#323232",
};

const Playbook = () => {
  const [value, setValue] = useState<Color>(defaultPaletteColor);

  return <ColorPicker label="Couleur" palette={samplePalette} value={value} onChange={setValue} />;
};

export { Playbook as ColorPicker };

export const WithInherit = () => {
  const [value, setValue] = useState<Color>(defaultPaletteColor);

  return (
    <ColorPicker
      label="Couleur (hérite possible)"
      palette={samplePalette}
      value={value}
      onChange={setValue}
      allowInherit={true}
    />
  );
};
