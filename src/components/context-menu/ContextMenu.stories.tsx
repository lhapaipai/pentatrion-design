import { Meta } from "@storybook/react-vite";
import { ContextMenu } from "./ContextMenu";
import { ContextMenuItem } from "./ContextMenuItem";
import { action } from "storybook/actions";

const onChangeAction = action("onChange");

const meta = {
  title: "Components/ContextMenu",
} satisfies Meta;
export default meta;

export const Basic = () => {
  return (
    <ContextMenu>
      <ContextMenuItem label="Back" onClick={onChangeAction} />
      <ContextMenuItem label="Forward" />
      <ContextMenuItem label="Reload" disabled />
      <ContextMenuItem label="Save As..." />
      <ContextMenuItem label="Print" />
    </ContextMenu>
  );
};
