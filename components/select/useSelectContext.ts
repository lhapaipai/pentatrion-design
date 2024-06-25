import { useInteractions } from "@floating-ui/react";
import { createContext, useContext } from "react";

interface SelectContext {
  activeIndex: number | null;
  selectedIndex: number | null;
  getItemProps: ReturnType<typeof useInteractions>["getItemProps"];
  handleSelect: (index: number | null) => void;
}

export const SelectContext = createContext<SelectContext | null>(null);

export function useSelect() {
  const context = useContext(SelectContext);
  if (context === null) {
    throw new Error("Select components must be wrapped in <Select>");
  }
  return context;
}
