import { RefObject, useEffect, useMemo, useRef, useState } from "react";
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
import { ThemeBaseColor } from "../../types";

const arrowWidth = 16;

export type UseTooltipReturn = {
  open: boolean;
  setOpen?: (open: boolean) => void;
  color?: ThemeBaseColor;
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
  const lastInteractionRef = useRef<"keyboard" | "pointer">("keyboard");

  useEffect(() => {
    function onKeyDown() {
      lastInteractionRef.current = "keyboard";
    }
    function onPointerDown() {
      lastInteractionRef.current = "pointer";
    }
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, []);

  const offsetVal = arrowWidth / 2;

  const data = useFloating({
    placement,
    open,
    onOpenChange(nextOpen, _event, reason) {
      if (nextOpen && reason === "focus" && lastInteractionRef.current === "pointer") {
        return;
      }
      setOpen?.(nextOpen);
    },
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
    mouseOnly: true,
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
