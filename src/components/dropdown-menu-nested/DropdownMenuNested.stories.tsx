import { DropdownMenuNested } from "./DropdownMenuNested";
import { MenuItem } from "./MenuItem";
import { MenuItemWithChildren } from "./MenuItemWithChildren";

import { Button } from "../button/Button";

import { Meta } from "@storybook/react";

const meta = {
  title: "Components/DropdownMenuNested",
  component: DropdownMenuNested,
} satisfies Meta<typeof DropdownMenuNested>;
export default meta;

export const Basic = () => (
  <DropdownMenuNested label="Edit" triggerComponent={Button} color="gray" variant="text">
    <MenuItem label="Undo" onClick={() => console.log("Undo")} />
    <MenuItem label="Redo" disabled />
    <MenuItem label="Cut" />
    <MenuItemWithChildren label="Copy as">
      <MenuItem label="Text" />
      <MenuItem label="Video" />
      <MenuItemWithChildren label="Image">
        <MenuItem label=".png" />
        <MenuItem label=".jpg" />
        <MenuItem label=".svg" />
        <MenuItem label=".gif" />
      </MenuItemWithChildren>
      <MenuItem label="Audio" />
    </MenuItemWithChildren>
    <MenuItemWithChildren label="Share">
      <MenuItem label="Mail" />
      <MenuItem label="Instagram" />
    </MenuItemWithChildren>
  </DropdownMenuNested>
);
