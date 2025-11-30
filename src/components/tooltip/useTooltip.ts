import { RefObject, useMemo, useRef, useState } from "react";
import { TooltipOptions } from "./interface";
import {
  arrow,
  autoUpdate,
  flip,
  hide,
  offset,
  shift,
  useDismiss,
  useFloating,
  UseFloatingReturn,
  useFocus,
  useHover,
  useInteractions,
  UseInteractionsReturn,
  useRole,
} from "@floating-ui/react";
import { ThemeColor } from "../../types";

const arrowWidth = 16;

export type UseTooltipReturn = {
  open: boolean;
  setOpen?: (open: boolean) => void;
  color?: ThemeColor;
  arrowRef: RefObject<HTMLDivElement | null>;
} & UseInteractionsReturn &
  UseFloatingReturn;

export function useTooltip({
  initialOpen = false,
  placement = "top",
  open: controlledOpen,
  onOpen: setControlledOpen,
  openDelay = 500,
  closeDelay = 500,
  color = "yellow",
}: TooltipOptions = {}): UseTooltipReturn {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

  const isUncontrolled = controlledOpen === null || controlledOpen === undefined;

  const open = isUncontrolled ? uncontrolledOpen : controlledOpen;
  const setOpen = isUncontrolled ? setUncontrolledOpen : setControlledOpen;

  const arrowRef = useRef<HTMLDivElement>(null);

  const offsetVal = arrowWidth / 2;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetVal),
      flip(),
      shift({ padding: 5 }),
      arrow({
        element: arrowRef,
        padding: 12,
      }),
      hide({
        padding: 20,
      }),
    ],
  });
  const { context } = data;

  const hover = useHover(context, {
    move: false,
    enabled: isUncontrolled,
    delay: {
      open: openDelay || 1,
      close: closeDelay,
    },
  });
  const focus = useFocus(context, {
    enabled: isUncontrolled,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      arrowRef,
      color,
    }),
    [open, setOpen, color, interactions, data],
  );
}
