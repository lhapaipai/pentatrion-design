import { RefObject } from "react";
import { MenuItemWithChildren } from "./MenuItemWithChildren";
import { FloatingTree } from "@floating-ui/react";
import { Button, type ButtonProps } from "../button/Button";

export interface Props extends ButtonProps {
  label: string;
  triggerComponent: typeof Button;
  ref?: RefObject<HTMLButtonElement>;
}

export function DropdownMenuNested({ ref, ...props }: Props) {
  return (
    <FloatingTree>
      <MenuItemWithChildren {...props} ref={ref} />
    </FloatingTree>
  );
}
