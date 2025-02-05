import { ReactNode } from "react";
import { DropdownMenuContext } from "./useDropdownMenuContext";
import { useDropdownMenu } from "./useDropdownMenu";
import { ComponentProps, forwardRef } from "react";
import {
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  useMergeRefs,
} from "@floating-ui/react";
import clsx from "clsx";
import { Dialog } from "../dialog";
import { Slot } from "../slot";
import { UseDropdownMenuOptions } from "./interface";

type DropdownMenuProps = ComponentProps<"div"> &
  UseDropdownMenuOptions & {
    trigger: ReactNode;
  };

export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    {
      // options
      trigger,
      initialOpen,
      placement,
      open,
      onOpen,
      color,
      modal,

      // ComponentProps
      style,
      className,
      children,
      ...props
    },
    propRef,
  ) => {
    const options = { initialOpen, placement, open, onOpen, color, modal };
    const popover = useDropdownMenu(options);
    const floatingContext = popover.context;

    const ref = useMergeRefs([popover.refs.setFloating, propRef]);

    return (
      <DropdownMenuContext.Provider value={popover}>
        <Slot
          ref={popover.refs.setReference}
          data-state={popover.open ? "open" : "closed"}
          {...popover.getReferenceProps()}
        >
          {trigger}
        </Slot>
        {popover.open && (
          <FloatingPortal>
            <FloatingFocusManager context={floatingContext} modal={popover.modal}>
              <div
                ref={ref}
                className={clsx("z-dialog outline-hidden", className)}
                style={{ ...popover.floatingStyles, ...style }}
                {...popover.getFloatingProps(props)}
              >
                <Dialog
                  placement={popover.placement}
                  color={popover.color}
                  className="p-2 motion-safe:animate-fade-in"
                >
                  <div className="box">
                    <FloatingList elementsRef={popover.elementsRef} labelsRef={popover.labelsRef}>
                      {children}
                    </FloatingList>
                  </div>
                </Dialog>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </DropdownMenuContext.Provider>
    );
  },
);
