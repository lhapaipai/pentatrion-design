import { ComponentProps, RefObject } from "react";
import { usePopoverContext } from ".";
import { FloatingFocusManager, FloatingPortal, useMergeRefs } from "@floating-ui/react";
import clsx from "clsx";
import { computeArrowStyle } from "../dialog/util";
import { Dialog } from "../dialog";

interface Props extends ComponentProps<"div"> {
  ref?: RefObject<HTMLInputElement>;
}

export function PopoverContent({ style, children, className, ref, ...props }: Props) {
  const context = usePopoverContext();
  const floatingContext = context.context;

  const mergedRef = useMergeRefs([context.refs.setFloating, ref]);
  if (!context.open) {
    return null;
  }
  return (
    <FloatingPortal>
      <FloatingFocusManager context={floatingContext} modal={context.modal}>
        <div
          className="outline-hidden"
          ref={mergedRef}
          style={{ ...context.floatingStyles, ...style }}
          aria-labelledby={context.labelId}
          aria-describedby={context.descriptionId}
          {...context.getFloatingProps(props)}
        >
          <Dialog
            placement={context.placement}
            color={context.color}
            className={clsx("motion-safe:animate-fade-in-list", className)}
          >
            {children}
            <div
              ref={context.arrowRef}
              style={computeArrowStyle(context)}
              className="p8n-arrow"
            ></div>
          </Dialog>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}
