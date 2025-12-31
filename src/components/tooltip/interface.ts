import { Placement } from "@floating-ui/react";
import { ThemeBaseColor } from "../../types";

export interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpen?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  color?: ThemeBaseColor;
  contentClassName?: string;
}
