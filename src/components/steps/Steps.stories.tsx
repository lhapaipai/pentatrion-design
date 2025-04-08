import { Meta } from "@storybook/react";
import { Step } from "./Step";
import { Steps } from "./Steps";

import { Input } from "../input";

const meta = {
  title: "Components/Steps",
  component: Steps,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Steps>;

export default meta;

export const Context = () => {
  return (
    <div className="grid grid-cols-1 gap-8">
      <Steps direction="horizontal" lineStyle="dotted">
        <Step icon="A" status="done">
          <h4 className="text-body-sm">Step 1</h4>
          <p className="text-body-xs">Some desc text</p>
        </Step>
        <Step icon="B" status="current">
          <h4 className="text-body-sm">Step 2</h4>
        </Step>
        <Step icon="C" status="todo">
          <h4 className="text-body-sm">Step 3</h4>
          <p className="text-body-xs">Another description</p>
        </Step>
        <Step icon="D" status="todo">
          <h4 className="text-body-sm">Step 4</h4>
        </Step>
      </Steps>
      <Steps direction="horizontal" markerType="bullet">
        <Step status="done">
          <h4 className="text-body-sm">Step 1</h4>
          <p className="text-body-xs">Some desc text</p>
        </Step>
        <Step status="current">
          <h4 className="text-body-sm">Step 2</h4>
        </Step>
        <Step status="todo">
          <h4 className="text-body-sm">Step 3</h4>
          <p className="text-body-xs">Another description</p>
        </Step>
        <Step status="todo">
          <h4 className="text-body-sm">Step 4</h4>
        </Step>
      </Steps>
      <Steps lineStyle="dotted">
        <Step icon="A" status="done">
          <h4 className="text-body-sm">Step 1</h4>
          <p className="text-body-xs">Some desc text</p>
        </Step>
        <Step icon="B" status="current" align="center">
          <Input defaultValue="Hello world" />
        </Step>
        <Step icon="C" status="todo">
          <h4 className="text-body-sm">Step 3</h4>
          <p className="text-body-xs">
            Some desc text
            <br />
            with much more content
          </p>
        </Step>
        <Step icon="D" status="todo">
          <Input defaultValue="Hello world" />
        </Step>
      </Steps>
      <Steps markerType="bullet" lineStyle="dotted">
        <Step status="done">
          <h4 className="text-body-sm">Step 1</h4>
          <p className="text-body-xs">Some desc text</p>
        </Step>
        <Step icon="B" status="current">
          <Input defaultValue="Hello world" />
        </Step>
        <Step icon="C" status="todo">
          <Input defaultValue="Hello world" />
        </Step>
        <Step icon="D" status="todo">
          <Input defaultValue="Hello world" />
        </Step>
      </Steps>
    </div>
  );
};
