import { cloneElement, forwardRef, isValidElement } from "react";
import { useMergeRefs } from "@floating-ui/react";
import { Button, ButtonProps } from "../button/Button";
import { useModalContext } from "./useModalContext";

interface Props extends ButtonProps {
  asChild?: boolean;
}

export const ModalTrigger = forwardRef<HTMLElement, Props>(
  ({ children, asChild = false, size, ...props }, propRef) => {
    const context = useModalContext();
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
      <Button
        type="button"
        ref={ref}
        size={size}
        data-state={context.open ? "open" : "closed"}
        {...context.getReferenceProps(props)}
      >
        {children}
      </Button>
    );
  },
);
