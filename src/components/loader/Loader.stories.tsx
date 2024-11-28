import { Meta, StoryObj } from "@storybook/react";
import { Loader } from "./Loader";

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

export const Context = () => (
  <div className="flex flex-col gap-2">
    <Loader size="small" />
    <br />
    <Loader size="medium" color="yellow" />
    <br />
    <Loader size="large" color="red" />
    <br />
    <Loader size="medium" color="gray" />
    <br />
    <Loader color="custom" className="text-[#ff0000]" />
  </div>
);
