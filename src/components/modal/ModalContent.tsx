import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useMergeRefs,
} from "@floating-ui/react";
import { ComponentProps, RefObject } from "react";
import { useModalContext } from "./useModalContext";
import clsx from "clsx";
import { Dialog } from "../dialog/Dialog";

interface Props extends ComponentProps<"div"> {
  ref?: RefObject<HTMLInputElement>;
  zClassName?: string;
}

export function ModalContent({ zClassName, style, className, children, ref, ...props }: Props) {
  const context = useModalContext();
  const floatingContext = context.context;

  const mergedRef = useMergeRefs([context.refs.setFloating, ref]);
  if (!context.open) {
    return null;
  }

  return (
    <FloatingPortal>
      <FloatingOverlay
        className={clsx(
          "flex-center bg-gray-7/40 motion-safe:animate-fade-in-opacity",
          zClassName ?? "z-overlay",
        )}
        lockScroll
      >
        <FloatingFocusManager context={floatingContext}>
          <Dialog
            color={context.color}
            className={clsx("motion-safe:animate-fade-in mx-4", className)}
            style={style}
            aria-labelledby={context.labelId}
            aria-describedby={context.descriptionId}
            {...context.getFloatingProps(props)}
          >
            <div ref={mergedRef}>{children}</div>
          </Dialog>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}
