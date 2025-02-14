import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../button/Button";
import { Input } from "./Input";
import { Loader } from "../loader/Loader";

const meta = {
  title: "Components/Input/Text",
  component: Input,
  argTypes: {
    prefix: {
      control: "text",
    },
    suffix: {
      control: "text",
    },
  },
} satisfies Meta<typeof Input>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Playbook: Story = {
  args: {
    disabled: false,
    prefix: "",
    suffix: "",
  },
};

export const Context = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div className="my-4 flex flex-col gap-2">
      <Input />
      <Input color="gray" />
      <Input color="red" />
      <Input color="orange" />
      <Input color="green" />
      <Input color="blue" />
      <Input variant="ghost" defaultValue="ghost" />
      <Input color="gray" variant="ghost" defaultValue="gray ghost" />
      <Input color="blue" variant="ghost" defaultValue="blue ghost" />
      <Input size="small" defaultValue="size small" />
      <Input size="large" defaultValue="size large" />
      <Input size="custom" className="h-20" defaultValue="size custom h-20" />
      <Input disabled defaultValue="disabled input" />
      <Input
        readOnly
        defaultValue="readonly input"
        suffix={
          <Button withRipple={true} icon size="input" variant="text" color="gray">
            <i className="fe-clipboard-copy"></i>
          </Button>
        }
      />
      <Input placeholder="Your first name" />
      <Input
        prefix={
          <span className="flex-center h-8 w-8">
            <i className="fe-search"></i>
          </span>
        }
      />
      <Input
        prefix={
          <>
            <Loader size="medium" color="gray" />
            <span className="flex-center -ml-8 h-8 w-8">
              <i className="fe-search"></i>
            </span>
          </>
        }
      />
      <Input
        suffix={
          <Button size="input" withRipple={true} icon variant="text" color="gray">
            <i className="fe-cancel"></i>
          </Button>
        }
      />{" "}
      <Input
        suffix={
          <Button size="input" withRipple={true} icon variant="ghost" color="gray">
            <i className="fe-cancel"></i>
          </Button>
        }
      />
      <Input
        suffix={
          <>
            <Button size="input" withRipple={true} icon variant="ghost" color="gray">
              <i className="fe-cancel"></i>
            </Button>
            <Loader size="medium" color="gray" />
          </>
        }
      />
      <Input
        suffix={
          <>
            <Loader size="medium" color="gray" />
          </>
        }
      />
      <Input prefix="prefix" />
      <Input suffix="suffix" />
      <Input
        type="number"
        value={counter}
        onChange={(e) => {
          e.target.validity.valid && setCounter(e.target.valueAsNumber);
        }}
      />
      <div className="flex gap-2">
        <Input className="flex-1" />
        <Button>Valider</Button>
      </div>
      <Input type="date" />
    </div>
  );
};
