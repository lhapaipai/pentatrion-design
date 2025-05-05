import { ReactNode, RefObject } from "react";
import { DropdownMenuContext } from "./useDropdownMenuContext";
import { useDropdownMenu } from "./useDropdownMenu";
import { ComponentProps } from "react";
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
    ref?: RefObject<HTMLDivElement>;
    listClassName?: string;
  };

export const DropdownMenu = ({
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
  listClassName,
  children,
  ref,
  ...props
}: DropdownMenuProps) => {
  const options = { initialOpen, placement, open, onOpen, color, modal };
  const popover = useDropdownMenu(options);
  const floatingContext = popover.context;

  const mergedRef = useMergeRefs([popover.refs.setFloating, ref]);

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
              ref={mergedRef}
              className={clsx("z-dialog outline-hidden", className)}
              style={{ ...popover.floatingStyles, ...style }}
              {...popover.getFloatingProps(props)}
            >
              <Dialog
                placement={popover.placement}
                color={popover.color}
                className="motion-safe:animate-fade-in p-1"
              >
                <div className={clsx("box", listClassName)}>
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
};
