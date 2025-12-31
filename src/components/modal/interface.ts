import { type ThemeBaseColor } from "../../types";

export interface ModalOptions {
  initialOpen?: boolean;
  open?: boolean;
  onOpen?: (open: boolean) => void;
  color?: ThemeBaseColor;
}
