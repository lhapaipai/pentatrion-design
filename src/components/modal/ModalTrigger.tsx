import { cloneElement, isValidElement } from "react";
import { useMergeRefs } from "@floating-ui/react";
import { Button, ButtonProps } from "../button/Button";
import { useModalContext } from "./useModalContext";

interface Props extends ButtonProps {
  asChild?: boolean;
}

export function ModalTrigger({ children, asChild = false, size, ref, ...props }: Props) {
  const context = useModalContext();
  const childrenRef = (children as any).ref;

  const mergedRefs = useMergeRefs([context.refs.setReference, ref, childrenRef]);

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...(children.props ?? {}),
        // @ts-ignore
        "data-state": context.open ? "open" : "closed",
      }),
    );
  }

  return (
    <Button
      type="button"
      ref={mergedRefs as any}
      size={size}
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps(props)}
    >
      {children}
    </Button>
  );
}
