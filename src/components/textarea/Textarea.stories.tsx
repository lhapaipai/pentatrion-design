import { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./Textarea";
import { Button } from "../button";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
} satisfies Meta<typeof Textarea>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playbook: Story = {};

export const Context = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        <Textarea className="h-24" color="yellow" />
        <Textarea className="h-24" color="gray" />
        <Textarea className="h-24" color="green" />
        <Textarea className="h-24" color="red" />
        <Textarea className="h-24" color="orange" />
        <Textarea className="h-24" color="blue" />
        <Textarea className="h-24" disabled value="disabled" />
        <Textarea
          className="h-24"
          color="yellow"
          readOnly
          value="readonly yellow"
          action={
            <Button withRipple={false} icon variant="text" color="gray">
              <i className="fe-clipboard-copy"></i>
            </Button>
          }
        />
        <Textarea className="h-24" color="gray" readOnly value="readonly gray " />
        <Textarea className="h-24" color="green" readOnly value="readonly green" />
      </div>
      <div className="mt-4">
        <h2>Without h-XXX specification</h2>
        <Textarea color="yellow" />
      </div>
    </>
  );
};
