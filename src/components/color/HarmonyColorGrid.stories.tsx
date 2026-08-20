import { useState } from "react";
import type { Meta } from "@storybook/react-vite";
import { HarmonyColorGrid } from "./HarmonyColorGrid";
import type { RawColor } from "./config";

const meta = {
  title: "Components/Color/HarmonyColorGrid",
  component: HarmonyColorGrid,
} satisfies Meta<typeof HarmonyColorGrid>;
export default meta;

const refColor: RawColor = { type: "raw", hex: "#ff0000" };

const Playbook = () => {
  const [value, setValue] = useState<RawColor | null>(null);

  return (
    <div className="max-w-64">
      <HarmonyColorGrid refColor={refColor} color={value} onChange={setValue} />
      <div className="shadow-sm w-72 rounded-2xl mt-4 p-2">
        <dl className="p8n-setting">
          <dt>value</dt>
          <dd className="flex items-center gap-2">
            <span
              className="inline-block h-6 w-6 rounded shadow"
              style={{ backgroundColor: value?.hex ?? "transparent" }}
            ></span>
            {value?.hex ?? "—"}
          </dd>
        </dl>
      </div>
    </div>
  );
};

export { Playbook as HarmonyColorGrid };
