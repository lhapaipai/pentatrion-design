import { HTMLProps, RefObject, cloneElement, isValidElement } from "react";
import { useTooltipContext } from "./useTooltipContext";
import { useMergeRefs } from "@floating-ui/react";

interface Props extends HTMLProps<HTMLElement> {
  /* allows the user to pass any element as the anchor instead of <button> */
  asChild?: boolean;
  ref?: RefObject<HTMLElement>;
}

export function TooltipTrigger({ children, asChild = false, ref, ...props }: Props) {
  const context = useTooltipContext();
  const childrenRef = (children as any).ref;
  const mergedRef = useMergeRefs([context.refs.setReference, ref, childrenRef]);

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ref: mergedRef,
        ...props,
        ...(children.props ?? {}),
        // @ts-ignore
        "data-state": context.open ? "open" : "closed",
      }),
    );
  }

  return (
    <abbr ref={mergedRef} {...context.getReferenceProps(props)}>
      {children}
    </abbr>
  );
}
