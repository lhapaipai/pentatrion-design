import type { Meta } from "@storybook/react-vite";

import { TotpInput } from "./TotpInput";
import { useState } from "react";

const meta = {
  title: "Components/Input/TotpInput",
  component: TotpInput,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof TotpInput>;

export default meta;

export const Basic = () => {
  const [value, setValue] = useState("");

  return <TotpInput value={value} length={6} onValue={setValue} />;
};
