import { Meta } from "@storybook/react-vite";
import { ColorPreview } from "./ColorPreview";
import { BrandPalette } from "./config";

const meta = {
  title: "Components/Color/ColorPreview",
  component: ColorPreview,
} satisfies Meta<typeof ColorPreview>;
export default meta;

const samplePalette: BrandPalette = {
  primary: "#ffca0a",
  secondary: "#3b82f6",
  tertiary: "#ec4899",
  text: "#323232",
};

export const Context = () => {
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="flex flex-col items-start gap-2">
        <div>string (raccourci hex)</div>
        <ColorPreview value="#fecdba" />
        <ColorPreview value="#fecdba" label="300" />
        <ColorPreview value="#fecdba" showValue={true} />
      </div>

      <div className="flex flex-col items-start gap-2">
        <div>RawColor (type: "raw", hex)</div>
        <ColorPreview value={{ type: "raw", hex: "#fecdba" }} showValue={true} />
      </div>

      <div className="flex flex-col items-start gap-2">
        <div>NamedColor (type: "named", name, variant)</div>
        <ColorPreview
          value={{ type: "named", name: "primary", variant: 0 }}
          palette={samplePalette}
          showValue={true}
        />
        <ColorPreview
          value={{ type: "named", name: "primary", variant: 40 }}
          palette={samplePalette}
          showValue={true}
        />
        <ColorPreview
          value={{ type: "named", name: "secondary", variant: -40 }}
          palette={samplePalette}
          showValue={true}
        />
        <ColorPreview
          value={{ type: "named", name: "gray", variant: 0 }}
          palette={samplePalette}
          showValue={true}
        />
      </div>

      <div className="flex flex-col items-start gap-2">
        <div>null / undefined (valeur par défaut)</div>
        <ColorPreview value={null} showValue={true} />
        <ColorPreview showValue={true} />
      </div>
    </div>
  );
};
