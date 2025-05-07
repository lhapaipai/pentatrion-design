import { ReactNode, useMemo, useState } from "react";
import { AccordionContext } from "./useAccordion";
import { useEffectEvent } from "../../hooks";

interface Props {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  children: ReactNode;
}

const noop = () => {};

export function Accordion({
  value: controlledValue,
  defaultValue,
  onChange = noop,
  children,
}: Props) {
  const isControlled = typeof controlledValue !== "undefined";
  const [unControlledValue, setUnControlledValue] = useState<string | null>(defaultValue ?? null);

  const value = (isControlled ? controlledValue : unControlledValue) ?? null;

  const stableOnChange = useEffectEvent(onChange);

  const context = useMemo(
    () => ({
      value,
      onChange(value: string | null) {
        if (!isControlled) {
          setUnControlledValue(value);
        }
        stableOnChange(value);
      },
    }),
    [value, stableOnChange, isControlled],
  );

  return <AccordionContext.Provider value={context}>{children}</AccordionContext.Provider>;
}
