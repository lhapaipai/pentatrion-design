import { Placement } from "@floating-ui/react";
import { ThemeBaseColor } from "../../types";

export interface UseDropdownMenuOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpen?: (open: boolean) => void;
  color?: ThemeBaseColor;
  modal?: boolean;
  presentation?: "compact" | "large";
}
