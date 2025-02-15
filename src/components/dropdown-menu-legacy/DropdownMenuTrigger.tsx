import { useDropdownMenuContext } from "./useDropdownMenuContext";
import { useMergeRefs } from "@floating-ui/react";
import { Button, ButtonProps } from "../button";

export function DropdownMenuTrigger({
  variant = "text",
  color = "gray",
  children,
  asChild = false,
  ref,
  ...props
}: ButtonProps) {
  const context = useDropdownMenuContext();
  const childrenRef = (children as any).ref;

  const mergedRefs = useMergeRefs([context.refs.setReference, ref, childrenRef]);

  return (
    <Button
      asChild={asChild}
      variant={variant}
      color={color}
      ref={mergedRefs as any}
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps()}
      {...props}
    >
      {children}
    </Button>
  );
}
