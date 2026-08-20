import { useState } from "react";
import type { Meta } from "@storybook/react-vite";
import { RawColorGrid } from "./RawColorGrid";
import { RawColor } from "./config";

const meta = {
  title: "Components/Color/RawColorGrid",
  component: RawColorGrid,
} satisfies Meta<typeof RawColorGrid>;
export default meta;

const Playbook = () => {
  const [color, setColor] = useState<RawColor | null>(null);

  return (
    <>
      <RawColorGrid color={color} onChange={setColor} />
      <div className="shadow-sm w-72 rounded-2xl mt-4 p-2">
        <dl className="p8n-setting">
          <dt>value</dt>
          <dd className="flex items-center gap-2">
            <span
              className="inline-block h-6 w-6 rounded shadow"
              style={{ backgroundColor: color?.hex ?? "transparent" }}
            ></span>
            {color?.hex ?? "—"}
          </dd>
        </dl>
      </div>
    </>
  );
};

export { Playbook as RawColorGrid };
