import { createContext, useContext } from "react";

export const AccordionContext = createContext<{
  value: string | null;
  onChange: (value: string | null) => void;
} | null>(null);

export const useAccordion = () => {
  const context = useContext(AccordionContext);

  if (context === null) {
    throw new Error("useAccordion to be use inside Accordion component");
  }

  return context;
};
