import { forwardRef } from "react";
import { MenuItemWithChildren } from "./MenuItemWithChildren";
import { FloatingTree } from "@floating-ui/react";
import { Button, type ButtonProps } from "../button/Button";

export interface Props extends ButtonProps {
  label: string;
  triggerComponent: typeof Button;
}

export const DropdownMenuNested = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  return (
    <FloatingTree>
      <MenuItemWithChildren {...props} ref={ref} />
    </FloatingTree>
  );
});
