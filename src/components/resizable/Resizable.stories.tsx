import type { Meta, StoryObj } from "@storybook/react-vite";

import { Resizable } from "./Resizable";
import { ResizablePanel } from "./ResizablePanel";
import { ResizableHandle } from "./ResizableHandle";
import clsx from "clsx";

const meta = {
  title: "Components/Resizable",
  component: Resizable,
} satisfies Meta<typeof Resizable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Context = () => {
  return (
    <Resizable className="bg-gray-1 w-[768px]">
      <ResizablePanel className="bg-gray-2">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid ab doloremque
          consectetur, fugiat totam tempora assumenda alias ratione. Expedita magni voluptates ea
          saepe facere iusto ratione deserunt dignissimos cum veritatis?
        </p>
      </ResizablePanel>
      <ResizableHandle
        className={clsx("bg-gray-5 group-data-dragging:bg-gray-7 hover:bg-gray-6")}
      />
    </Resizable>
  );
};
