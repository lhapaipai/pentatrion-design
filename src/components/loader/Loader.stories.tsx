import { Meta, StoryObj } from "@storybook/react-vite";
import { Loader } from "./Loader";
import { useState } from "react";
import { Button } from "../button";

const meta = {
  title: "Components/Loader",
  component: Loader,
  argTypes: {
    color: {
      control: {
        type: "select",
      },
      options: ["yellow", "gray", "red", "orange", "green", "blue"],
    },
  },
} satisfies Meta<typeof Loader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playbook: Story = {
  args: {
    size: "medium",
    color: "yellow",
  },
};

export const Context = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex flex-col gap-2">
      <Loader size="small" />
      <Loader size="medium" color="yellow" />
      <Loader size="large" color="red" />
      <Loader size="small">
        <i className="fe-search text-body-xs" />
      </Loader>
      <Loader size="medium" color="yellow">
        <i className="fe-search text-body-md" />
      </Loader>
      <Loader size="large" color="red">
        <i className="fe-search text-body-xl" />
      </Loader>
      <Loader size="medium" color="gray" />
      <Loader color="custom" className="text-[#ff0000]" />
      <div className="flex">
        <Loader loading={isLoading} size="medium" color="gray">
          <i className="fe-search text-body-md" />
        </Loader>
        <Button onClick={() => setIsLoading((s) => !s)}>Toggle loading</Button>
      </div>
    </div>
  );
};
