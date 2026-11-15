import { useState } from "react";
import type { Meta } from "@storybook/react-vite";
import { ChromaticityGrid } from "./ChromaticityGrid";
import type { Chromaticity } from "./config";
import { getChromaticityValue } from "../../lib/palette";

const meta = {
  title: "Components/Color/ChromaticityGrid",
  component: ChromaticityGrid,
} satisfies Meta<typeof ChromaticityGrid>;
export default meta;

const Playbook = () => {
  const [value, setValue] = useState<Chromaticity | null>(null);

  return (
    <div className="max-w-140">
      <ChromaticityGrid value={value} onChange={setValue} />
      <div className="shadow-sm w-72 rounded-2xl mt-4 p-2">
        <dl className="p8n-setting">
          <dt>value</dt>
          <dd className="flex items-center gap-2">
            <span
              className="inline-block h-6 w-6 rounded shadow"
              style={{ backgroundColor: value ? getChromaticityValue(value) : "transparent" }}
            ></span>
            {value ? `${value.hue}° · ${value.chroma}` : "—"}
          </dd>
        </dl>
      </div>
    </div>
  );
};

export { Playbook as ChromaticityGrid };
