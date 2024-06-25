import { HTMLProps, cloneElement, forwardRef, isValidElement } from "react";
import { useTooltipContext } from ".";
import { useMergeRefs } from "@floating-ui/react";

interface Props extends HTMLProps<HTMLElement> {
  /* allows the user to pass any element as the anchor instead of <button> */
  asChild?: boolean;
}

export const TooltipTrigger = forwardRef<HTMLElement, Props>(
  ({ children, asChild = false, ...props }, propRef) => {
    const context = useTooltipContext();
    const childrenRef = (children as any).ref;
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

    if (asChild && isValidElement(children)) {
      return cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...children.props,
          "data-state": context.open ? "open" : "closed",
        }),
      );
    }

    return (
      <abbr ref={ref} {...context.getReferenceProps(props)}>
        {children}
      </abbr>
    );
  },
);
