import { forwardRef } from "react";
import { useDropdownMenuContext } from "./useDropdownMenuContext";
import { useMergeRefs } from "@floating-ui/react";
import { Button, ButtonProps } from "../button";

export const DropdownMenuTrigger = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "text", color = "gray", children, asChild = false, ...props }, propRef) => {
    const context = useDropdownMenuContext();
    const childrenRef = (children as any).ref;

    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

    return (
      <Button
        asChild={asChild}
        variant={variant}
        color={color}
        ref={ref}
        data-state={context.open ? "open" : "closed"}
        {...context.getReferenceProps()}
        {...props}
      >
        {children}
      </Button>
    );
  },
);
