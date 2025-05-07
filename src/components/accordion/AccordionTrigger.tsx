import { ComponentProps } from "react";
import { useAccordion } from "./useAccordion";
import clsx from "clsx";

interface Props extends ComponentProps<"button"> {
  name: string;
}

export function AccordionTrigger({ name, children, ...rest }: Props) {
  const { value, onChange } = useAccordion();
  return (
    <button
      type="button"
      onClick={() => onChange(name === value ? null : name)}
      {...rest}
      className="border-l-yellow-4 bg-gray-0 hover:border-l-yellow-4 relative mt-[-1px] flex h-12 w-full cursor-pointer border border-l-4 border-black/5 hover:z-[1] hover:border-black/15"
    >
      <div className="flex-center h-12 w-12">
        <i className={clsx("fe-angle-up transition-transform", name !== value && "rotate-180")}></i>
      </div>
      <div className="flex flex-1 items-center">{children}</div>
    </button>
  );
}
