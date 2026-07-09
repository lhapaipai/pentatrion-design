import type { Meta } from "@storybook/react-vite";

import { Altcha } from "./Altcha";

const meta = {
  title: "Components/fields/Altcha",
  component: Altcha,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Altcha>;

export default meta;

export const Basic = () => {
  return (
    <Altcha
      challengeUrl="/altcha-challenge.json"
      onStateChange={(ev) => {
        if ("detail" in ev) {
          console.log("altcha statechange", ev.detail);
        }
      }}
    />
  );
};
