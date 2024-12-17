import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useMergeRefs,
} from "@floating-ui/react";
import { ComponentProps, forwardRef } from "react";
import { useModalContext } from "./useModalContext";
import clsx from "clsx";
import { Dialog } from "../dialog/Dialog";

export const ModalContent = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ style, className, children, ...props }, propRef) => {
    const context = useModalContext();
    const floatingContext = context.context;

    const ref = useMergeRefs([context.refs.setFloating, propRef]);
    if (!context.open) {
      return null;
    }

    return (
      <FloatingPortal>
        <FloatingOverlay
          className="flex-center z-overlay bg-gray-7/40 motion-safe:animate-fade-in-opacity"
          lockScroll
        >
          <FloatingFocusManager context={floatingContext}>
            <Dialog
              color={context.color}
              className={clsx("mx-4 motion-safe:animate-fade-in", className)}
              style={style}
              aria-labelledby={context.labelId}
              aria-describedby={context.descriptionId}
              {...context.getFloatingProps(props)}
            >
              <div ref={ref}>{children}</div>
            </Dialog>
          </FloatingFocusManager>
        </FloatingOverlay>
      </FloatingPortal>
    );
  },
);
