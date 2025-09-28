import { RefObject, useCallback, useMemo, useRef, useState } from "react";
import type { UseDropdownMenuOptions } from "./interface";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  UseFloatingReturn,
  useInteractions,
  UseInteractionsReturn,
  useListNavigation,
  useRole,
  useTypeahead,
} from "@floating-ui/react";
import { ThemeColor } from "../../types";

const arrowWidth = 12;

type UseDropdownMenuReturn = {
  open: boolean;
  setOpen: (open: boolean) => void;
  elementsRef: RefObject<(HTMLElement | null)[]>;
  labelsRef: RefObject<(string | null)[]>;
  color?: ThemeColor;
  modal: boolean;
  activeIndex: number | null;
  handleSelect: () => void;
  presentation: "compact" | "large";
} & UseInteractionsReturn &
  UseFloatingReturn;

export function useDropdownMenu({
  initialOpen = false,
  placement = "bottom",
  open: controlledOpen,
  onOpen: setControlledOpen,
  color,
  modal = false,
  presentation = "large",
}: UseDropdownMenuOptions): UseDropdownMenuReturn {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);

  const isUncontrolled = controlledOpen === null || controlledOpen === undefined;
  const open = isUncontrolled ? uncontrolledOpen : controlledOpen;
  const setOpen = isUncontrolled ? setUncontrolledOpen : setControlledOpen!;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const elementsRef = useRef<Array<HTMLElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);

  const offsetVal = 2 + arrowWidth / 2;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetVal),
      flip({
        // crossAxis: placement.includes('-'),
        // fallbackAxisSideDirection: "end",
      }),
      shift({ padding: 5 }),
    ],
  });

  const { context } = data;

  const click = useClick(context, {
    // TODO verify if use case to disable it
    // enabled: isUncontrolled,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const listNav = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });

  const handleSelect = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  function handleTypeaheadMatch(index: number | null) {
    if (open) {
      setActiveIndex(index);
    } else {
      handleSelect();
    }
  }

  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: handleTypeaheadMatch,
  });

  const interactions = useInteractions([click, dismiss, role, listNav, typeahead]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      elementsRef,
      labelsRef,
      color,
      modal,
      activeIndex,
      handleSelect,
      presentation,
    }),
    [
      open,
      setOpen,
      interactions,
      data,
      color,
      modal,
      activeIndex,
      // getItemProps,
      handleSelect,
      presentation,
    ],
  );
}
