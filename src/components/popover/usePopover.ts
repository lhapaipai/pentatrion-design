import { Dispatch, RefObject, SetStateAction, useMemo, useRef, useState } from "react";
import { PopoverOptions } from "./interface";
import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  UseInteractionsReturn,
  useRole,
  type UseFloatingReturn,
} from "@floating-ui/react";
import { ThemeColor } from "../../types";

const arrowWidth = 12;

export type UsePopoverReturn = {
  open: boolean;
  setOpen: (open: boolean) => void;
  arrowRef: RefObject<HTMLDivElement | null>;
  color?: ThemeColor;
  modal: boolean;
  labelId?: string;
  descriptionId?: string;
  setLabelId: Dispatch<SetStateAction<string | undefined>>;
  setDescriptionId: Dispatch<SetStateAction<string | undefined>>;
} & UseInteractionsReturn &
  UseFloatingReturn;

export function usePopover({
  initialOpen = false,
  placement = "bottom",
  open: controlledOpen,
  onOpen: setControlledOpen,
  color,
  modal = false,
}: PopoverOptions): UsePopoverReturn {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
  const [labelId, setLabelId] = useState<string | undefined>();
  const [descriptionId, setDescriptionId] = useState<string | undefined>();

  const isUncontrolled = controlledOpen === null || controlledOpen === undefined;
  const open = isUncontrolled ? uncontrolledOpen : controlledOpen;
  const setOpen = isUncontrolled ? setUncontrolledOpen : setControlledOpen!;

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
    ],
  });

  const { context } = data;

  const click = useClick(context, {
    // TODO verify if use case to disable it
    // enabled: isUncontrolled,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const interactions = useInteractions([click, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      arrowRef,
      color,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    }),
    [open, setOpen, interactions, data, color, modal, labelId, descriptionId],
  );
}
