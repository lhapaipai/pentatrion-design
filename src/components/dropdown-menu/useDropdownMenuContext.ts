import { createContext, useContext } from "react";
import { UseDropdownMenuReturn } from "./useDropdownMenu";

export const DropdownMenuContext = createContext<UseDropdownMenuReturn | null>(null);

export function useDropdownMenuContext(): UseDropdownMenuReturn {
  const context = useContext(DropdownMenuContext);

  if (context === null) {
    throw new Error("DropdownMenu components must be wrapped in <DropdownMenu />");
  }

  return context;
}
