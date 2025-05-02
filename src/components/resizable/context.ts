import { createContext, RefObject } from "react";

export const ResizableContext = createContext<{
  panelRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement>;
  scaleFactor: number;
} | null>(null);
