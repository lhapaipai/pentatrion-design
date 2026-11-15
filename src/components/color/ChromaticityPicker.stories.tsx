import { useState } from "react";
import type { Meta } from "@storybook/react-vite";
import { ChromaticityPicker } from "./ChromaticityPicker";
import type { Chromaticity } from "./config";

const meta = {
  title: "Components/Color/ChromaticityPicker",
  component: ChromaticityPicker,
} satisfies Meta<typeof ChromaticityPicker>;
export default meta;

const Playbook = () => {
  const [value, setValue] = useState<Chromaticity | null>({ hue: 67, chroma: 0.012 });

  return (
    <>
      <ChromaticityPicker
        label="Chromaticité du texte"
        value={value}
        onChange={setValue}
        allowInherit={true}
      />
      <div className="shadow-sm w-72 rounded-2xl mt-4 p-2">
        <dl className="p8n-setting">
          <dt>value</dt>
          <dd>{value ? `${value.hue}° · ${value.chroma}` : "null"}</dd>
        </dl>
      </div>
    </>
  );
};

export { Playbook as ChromaticityPicker };
