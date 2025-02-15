import { ComponentProps, RefObject } from "react";
import { useTooltipContext } from "./useTooltipContext";
import { FloatingPortal, useMergeRefs } from "@floating-ui/react";
import clsx from "clsx";
import { computeArrowStyle } from "../dialog/util";
import { Dialog } from "../dialog/Dialog";

interface Props extends ComponentProps<"div"> {
  ref?: RefObject<HTMLDivElement>;
}

export function TooltipContent({ style, children, className, ref, ...props }: Props) {
  const context = useTooltipContext();
  const mergedRef = useMergeRefs([context.refs.setFloating, ref]);
  if (!context.open) {
    return null;
  }
  return (
    <FloatingPortal>
      <div
        ref={mergedRef}
        className={clsx(
          "z-tooltip outline-hidden",
          context.middlewareData.hide?.referenceHidden && "invisible",
        )}
        style={{ ...context.floatingStyles, ...style }}
        {...context.getFloatingProps(props)}
      >
        <Dialog
          placement={context.placement}
          className={clsx("text-body-sm motion-safe:animate-fade-in max-w-80 px-2 py-1", className)}
          color={context.color}
          role="tooltip"
        >
          {children}
          <div
            ref={context.arrowRef}
            style={computeArrowStyle(context)}
            className="p8n-arrow"
          ></div>
        </Dialog>
      </div>
    </FloatingPortal>
  );
}
