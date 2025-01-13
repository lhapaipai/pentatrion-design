import { ReactNode } from "react";
import { DropdownMenuOptions } from "./interface";
import { DropdownMenuContext } from "./useDropdownMenuContext";
import { useDropdownMenu } from "./useDropdownMenu";

interface Props extends DropdownMenuOptions {
  children: ReactNode;
}

export function DropdownMenu({ children, ...options }: Props) {
  const popover = useDropdownMenu(options);
  return <DropdownMenuContext.Provider value={popover}>{children}</DropdownMenuContext.Provider>;
}
