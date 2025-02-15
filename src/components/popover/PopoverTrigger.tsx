import { HTMLProps, RefObject, cloneElement, isValidElement } from "react";
import { usePopoverContext } from ".";
import { useMergeRefs } from "@floating-ui/react";
import { Button } from "../button";

interface Props extends HTMLProps<HTMLElement> {
  asChild?: boolean;
  ref?: RefObject<HTMLElement>;
}

export function PopoverTrigger({ children, asChild = false, ref, ...props }: Props) {
  const context = usePopoverContext();
  const childrenRef = (children as any).ref;

  const mergedRefs = useMergeRefs([context.refs.setReference, ref, childrenRef]);

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        mergedRefs,
        ...props,
        ...(children.props ?? {}),
        // @ts-ignore
        "data-state": context.open ? "open" : "closed",
      }),
    );
  }

  return (
    <Button
      variant="outlined"
      ref={mergedRefs as any}
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps(props)}
    >
      {children}
    </Button>
  );
}
