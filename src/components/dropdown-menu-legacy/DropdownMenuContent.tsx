import { ComponentProps, RefObject } from "react";
import { useDropdownMenuContext } from "./useDropdownMenuContext";
import {
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  useMergeRefs,
} from "@floating-ui/react";
import clsx from "clsx";
import { Dialog } from "../dialog";

interface Props extends ComponentProps<"div"> {
  ref?: RefObject<HTMLDivElement>;
}

export function DropdownMenuContent({ style, className, children, ref, ...props }: Props) {
  const context = useDropdownMenuContext();
  const floatingContext = context.context;

  const mergedRef = useMergeRefs([context.refs.setFloating, ref]);
  if (!context.open) {
    return null;
  }
  return (
    <FloatingPortal>
      <FloatingFocusManager context={floatingContext} modal={context.modal}>
        <div
          ref={mergedRef}
          className={clsx("z-dialog outline-hidden", className)}
          style={{ ...context.floatingStyles, ...style }}
          {...context.getFloatingProps(props)}
        >
          <Dialog
            placement={context.placement}
            color={context.color}
            className="motion-safe:animate-fade-in p-2"
          >
            <div className="box">
              <FloatingList elementsRef={context.elementsRef} labelsRef={context.labelsRef}>
                {children}
              </FloatingList>
            </div>
          </Dialog>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}
